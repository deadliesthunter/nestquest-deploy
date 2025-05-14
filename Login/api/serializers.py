from rest_framework import serializers
from ..models import User, Property, Review, PropertyImage, PrivateMessage, Whishlist, Notification,Reservation
from django.utils import timezone


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "firstname", "lastname", "password", "email", "thumbnail","description"]

class PublicUserSerrializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "firstname", "lastname", "thumbnail","description"]
        
class UserNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","firstname", "lastname","thumbnail"]


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "uploaded_at"]


class PropertyModelSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    host = UserNameSerializer(read_only=True)
    host_id = serializers.UUIDField(write_only=True)
    longitude = serializers.SerializerMethodField() 
    latitude = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "description",
            "location",
            "price",
            "host",
            "host_id",
            "facilities",
            "is_available",
            "created_at",
            "images",
            "geo_location",
            "property_type",
            "longitude",
            "latitude",
            "distance",
        ]
    def get_distance(self, obj):
        if hasattr(obj, 'distance'): # this function checks whether distance was calculated for this ovject or not
            # Assuming obj.distance is a Distance object
            return round(float(obj.distance.m) / 1000, 2)
        return None
    def get_longitude(self, obj):
        return obj.geo_location.x

    def get_latitude(self, obj):
        return obj.geo_location.y

    def create(self, validated_data):
        host_id = validated_data.pop("host_id", None)
        if not host_id:
            raise serializers.ValidationError({"host_id": "This field is required."})

        try:
            host = User.objects.get(id=host_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"host_id": "Invalid user ID."})

        property_instance = Property.objects.create(host=host, **validated_data)
        return property_instance


class ReviewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["rating", "property", "comment", "user"]

class WhishlistInputSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Whishlist
        fields = ["user", "property"]

class WhishlistOutputSerializer(serializers.ModelSerializer):
    property = PropertyModelSerializer(read_only=True)  # Sends detailed property data
    user = UserNameSerializer(read_only=True)  # Sends detailed user data

    class Meta:
        model = Whishlist
        fields = ["user", "property"]
#class WhishlistModelSerializer(serializers.ModelSerializer):
#    property = PropertyModelSerializer()#sends entire deatil fo property # readonly = true means it is only for o/p only
#    user = UserNameSerializer() #sends entire detail of user
#    
#    class Meta:
#        model = Whishlist
#        fields = ["user", "property"] #this is for output only


class PrivateMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.firstname", read_only=True)
    receiver_name = serializers.CharField(source="receiver.firstname", read_only=True)

    class Meta:
        model = PrivateMessage
        fields = ["id", "sender_name", "receiver_name", "message", "timestamp"]

class UserLocationSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["latitude", "longitude"]

    def get_latitude(self,obj):
        if obj.current_location:
            return obj.current_location.y
        return None
    def get_longitude(self,obj):
        if obj.current_location:
            return obj.current_location.x
        return None
    
class UpdateUserLocationSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    
    def update(self, instance, validated_data):
        from django.contrib.gis.geos import Point
        
        # Optional: Add logic to prevent too frequent updates
        # e.g., if last_location_update was less than X minutes ago, skip
        
        latitude = validated_data.get('latitude')
        longitude = validated_data.get('longitude')
        instance.current_location = Point(longitude, latitude)
        instance.last_location_update = timezone.now()  # Track when updated
        instance.save()
        return instance
    
from django_rest_passwordreset.serializers import PasswordTokenSerializer
class CustomPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class CustomPasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    property_title = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'sender_name', 'property_title', 'message', 'is_read', 'created_at']
    
    def get_sender_name(self, obj):
        if obj.sender:
            return f"{obj.sender.firstname} {obj.sender.lastname}"
        return None
    
    def get_property_title(self, obj):
        if obj.property:
            return obj.property.title
        return None