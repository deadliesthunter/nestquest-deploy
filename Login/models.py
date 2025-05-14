import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.gis.db import models as geomodels
from .storage import OverwriteStorage
from django.utils import timezone

class UserManager(
    BaseUserManager
):  # This class inherits from BaseUserManager and is responsible for managing how users and superusers are created.
    def create_user(self, email, firstname, lastname, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(
            email=self.normalize_email(email),
            firstname=firstname,
            lastname=lastname,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, firstname, lastname, phone=None, password=None):
        user = self.create_user(
            email=email,
            firstname=firstname,
            lastname=lastname,
            password=password,
        )
        if phone:
            user.phone = phone
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


def upload_thumbnail(instance, filename):
    return f"thumbnails/{instance.email}.jpeg"  # force the file to be saved in jpeg


class User(AbstractBaseUser):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    email = models.EmailField(null=False, max_length=100, unique=True)
    firstname = models.CharField(null=False, max_length=100)
    lastname = models.CharField(null=False, max_length=100)
    current_location = geomodels.PointField(
        null=True,
        blank=True,
        srid=4326,
        help_text="Geolocation as (longitude, latitude)",
        ) # it is used to store the geolocation of the user
    phone = models.CharField(null=True, blank=True, max_length=15, unique=True)
    description = models.TextField(null =True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    thumbnail = models.ImageField(
        upload_to=upload_thumbnail,
        storage=OverwriteStorage(),  # using storage.py to overwrite
        null=True,  # meaning user don't have to upload the thumbnail
        blank=True,
        default="thumbnails/default.jpeg",
    )
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = (
        "email"  # this tells jango that username should be email rather than anyother
    )
    REQUIRED_FIELDS = [
        "firstname",
        "lastname",
        "phone",
    ]  # this tells the most req field

    objects = UserManager()  # The objects attribute is set to the UserManager class, which provides methods for creating users and superusers.

    def __str__(self):
        return f"{self.email}, {self.firstname}"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True


class Property(models.Model):  # used as post
    title = models.CharField(null=False, max_length=50)
    description = models.CharField(null=False, max_length=100)
    location = models.CharField(null=False, max_length=50)
    images = models.ManyToManyField("PropertyImage", related_name="properties")

    geo_location = geomodels.PointField(
        null=True,
        blank=True,
        srid=4326, 
        help_text="Geolocation as (longitude, latitude)",
    )  # it is used to store the geolocation of the property
    price = models.DecimalField(max_digits=10, decimal_places=2)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="property")
    facilities = models.CharField(
        max_length=100
    )  # facilities , and sent in json so that admin can set such stuff
    # e.g,{"wifi":True, "pool":false}
    is_available = models.BooleanField(null=False,default=True)
    created_at = models.DateField(auto_now_add=True)
    property_type = models.JSONField(
    null=True,
    blank=True,
    default=dict  # or default=lambda: {}
) # this is used to store the type of property e.g {"house":True,"apartment":False}

    REQUIRED_FIELDS = [
        "title",
        "location",
        "facilities",
        "gallery_urls",
        "property_type",
    ]

    def __str__(self):
        return f"{self.title},{self.host}"


class PropertyImage(
    models.Model
):  # this is the model to store the images of the property
    image = models.ImageField(upload_to="property_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.FloatField()
    comment = models.TextField()
    created_at = models.DateField(auto_now_add=True)

    REQUIRED_FIELDS = ["rating", "review"]

    def __str__(self):
        return f"{self.property},{self.rating}"


class Whishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="whishlist")
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="whishlist"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (
            "user",
            "property",
        )  # this is used to make sure that user can't bookmark the same property twice

    def __str__(self):
        return f"{self.user.email} bookmarked {self.property.title}"


class PrivateMessage(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="sent_messages", on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="received_messages",
        on_delete=models.CASCADE,
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.sender.firstname} -> {self.receiver.firstname} at {self.timestamp}"
        )



class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservations")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="reservations")
    created_at = models.DateTimeField(auto_now_add=True)

    reserved = models.BooleanField(default=False)

#notification
class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_notifications", null=True, blank=True)
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification to {self.recipient.email}: {self.message[:30]}"