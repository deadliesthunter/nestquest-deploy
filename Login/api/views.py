from rest_framework import viewsets
from ..models import User, Property, Review, PropertyImage, Whishlist,Notification
from .serializers import (
    UserModelSerializer,
    PropertyModelSerializer,
    ReviewModelSerializer,
    PropertyImageSerializer,
    PrivateMessageSerializer,
    WhishlistInputSerializer,
    WhishlistOutputSerializer,
    PublicUserSerrializer
)
from django.contrib.gis.geos import (
    Point,
)  # this is used to store the geolocation of the property

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_201_CREATED,
)
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView


def get_auth_for_user(user):
    pass


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email").lower()
        password = request.data.get("password")

        # Authenticate the user
        user = authenticate(request, email=email, password=password)
        if not user:
            return Response(
                {"error": "Invalid credentials"}, status=HTTP_400_BAD_REQUEST
            )

        # Get or create the token
        token, created = Token.objects.get_or_create(user=user)

        # Serialize user data
        serializer = UserModelSerializer(user)
        print(token.key)
        return Response(
            {"token": token.key, "user": serializer.data}, status=HTTP_200_OK
        )


from django.db import IntegrityError


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()  # Make mutable
        if 'email' in data:
            data['email'] = data['email'].lower()
        serializer = UserModelSerializer(data=data)
        # Check if the email already exists
        
        if User.objects.filter(email=request.data.get("email")).exists():
            return Response(
                {"error": "Email already exists"}, status=HTTP_400_BAD_REQUEST
            )
        if serializer.is_valid():
            try:
                user = serializer.save()
                user.set_password(request.data.get("password"))
                user.save()
                token = Token.objects.create(user=user)
                return Response(
                    {"token": token.key, "user": serializer.data},
                    status=HTTP_201_CREATED,
                )
            except IntegrityError:
                return Response(
                    {"error": "Email already exists"}, status=HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": "Internal server error "},
                    status=HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()  # querry to apply
    serializer_class = (
        UserModelSerializer  # this is for the transformation of serializersa
    )

    ############################################## DC Changes ##############################################


class CreatePropertyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data # Make mutable
        data["host_id"] = request.user.id  # Ensure host ID is passed
        # from here begins out geo stuff
        lat = data.get("latitude")
        lon = data.get("longitude")
        type = data.get("property_type")

        if lat and lon:
            try:
                data["geo_location"] = Point(
                    float(lon), float(lat)
                )  # point object takes (x,y):(longitude,latitude)
            except ValueError:
                return Response(
                    {"error": "Invalid latitude or longitude."},
                    status=HTTP_400_BAD_REQUEST,
                )
        images = request.FILES.getlist("images")  # Get uploaded images
        serializer = PropertyModelSerializer(data=data)

        if serializer.is_valid():
            property_instance = serializer.save()

            # Save images correctly
            image_instances = [
                PropertyImage.objects.create(image=image) for image in images
            ]
            property_instance.images.set(
                image_instances
            )  # Correct way to assign Many-to-Many

            return Response(serializer.data, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


# not sorted so precisely
class ReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        property_id = request.data.get("property_id")
        rating = request.data.get("rating")
        comment = request.data.get("comment")

        if not property_id:
            return Response(
                {"error": "property_id is required"}, status=HTTP_400_BAD_REQUEST
            )

        if not rating:
            return Response(
                {"error": "rating is required"}, status=HTTP_400_BAD_REQUEST
            )

        # Check if property exists
        try:
            property_instance = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"error": "Property not found"}, status=HTTP_400_BAD_REQUEST
            )



        # Create review entry
        review_data = {
            "user": user.id,
            "property": property_id,
            "rating": rating,
            "comment": comment,
        }

        serializer = ReviewModelSerializer(data=review_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


from rest_framework.parsers import MultiPartParser, FormParser


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Add support for file uploads

    def post(self, request):
        user = request.user  # Get current authenticated user
        serializer = UserModelSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Handle thumbnail upload if present in request
            if "thumbnail" in request.FILES:
                user.thumbnail = request.FILES["thumbnail"]
            if "firstname" and "lastname" in request.data:  # Update the user's name
                user.firstname = request.data["firstname"]
                user.lastname = request.data["lastname"]
            if "description" in request.data:  # Update the user's description
                user.description = request.data["description"]

            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = request.user
        serializer = UserModelSerializer(user)
        return Response(serializer.data, status=HTTP_200_OK)


class PublicFeedView(ListAPIView):  # works as get request as it is a list view
    """Returns all available properties in reverse chronological order (newest first)"""

    serializer_class = PropertyModelSerializer
    permission_classes = [AllowAny]  # Allow any user to access this view

    def get_queryset(self):
        queryset = Property.objects.filter(is_available=True)\
        .select_related("host")\
        .prefetch_related("images")
        
    # Add distance if user is authenticated and has location
        user = self.request.user
        if user.is_authenticated and user.current_location:
            from django.contrib.gis.db.models.functions import Distance
            queryset = queryset.annotate(
                distance=Distance('geo_location', user.current_location)
            )
            # Order by distance first, then by created date
            queryset = queryset.order_by('distance', '-created_at')
        else:
            # If no location, just order by created date
            queryset = queryset.order_by('-created_at')
        
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            # Prepare response data
            properties_data = serializer.data
            
            
            
            return Response({
                "status": "success",
                "count": queryset.count(),
                "properties": properties_data,
            }, status=HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)}, status=HTTP_400_BAD_REQUEST
            )

class UserDetailByIdView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, u_id):
        """
        Retrieve user data based on the given u_id.
        """
        try:
            # Fetch the user by u_id
            user = get_object_or_404(User, id=u_id)
            serializer = PublicUserSerrializer(user)
            return Response(serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)
        

class HostPropertiesView(ListAPIView):
    serializer_class = PropertyModelSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Returns all properties created by the user specified by `user_id`,
        ordered by creation date (newest first).
        """
        user_id = self.request.query_params.get("user_id")  # Get user_id from query params
        if not user_id:
            return Property.objects.none()  # Return an empty queryset if no user_id is provided

        return (
            Property.objects.filter(
                host_id=user_id,  # Use host_id to filter by the foreign key
            )
            .order_by("-created_at")  # Order by newest first
            .select_related("host")  # Optimize queries by selecting related host
            .prefetch_related("images")  # Optimize queries by prefetching related images
        )

    def list(self, request, *args, **kwargs):
        """
        Lists the properties of the user specified by `user_id`.
        """
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(
                {
                    "status": "success",
                    "count": queryset.count(),
                    "properties": serializer.data,
                },
                status=HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)}, status=HTTP_400_BAD_REQUEST
            )


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from ..models import User


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get("query", "")
    if not query:
        return Response([])

    users = User.objects.filter(
        Q(firstname__icontains=query) | Q(email__icontains=query)
    ).exclude(id=request.user.id)[:10]  # Exclude current user

    return Response(
        [
            {"user_id": user.id, "firstname": user.firstname, "email": user.email}
            for user in users
        ]
    )


@api_view(["GET"])
@permission_classes(
    [IsAuthenticated]
)  # decorators are necessary in each search function , future additionko lagi chainxa
def search_property(request):
    query = request.GET.get("query", "") #this is the query parameter from the frontend
    #it is filtered by the title, description and location of the property sent from the frontend
    distance_km = request.GET.get("distance", 5) # default fetch distance within 5km
    if not query:
        return Response([])
    
    base_query = Q(title__icontains=query) | Q(description__icontains=query) | Q(location__icontains=query)
    properties = Property.objects.filter(base_query)

    user = request.user
    if user.is_authenticated and user.current_location:
        from django.contrib.gis.db.models.functions import Distance

        properties = properties.annotate(
            distance = Distance("geo_location", user.current_location)
        )
        properties = properties.order_by("distance", "created_at")
    else:
        properties = properties.order_by("-created_at")
    properties = properties[:50] #limiting for proper optimization of property to be shown in search
    serialized = PropertyModelSerializer(properties, many=True)
    return Response(serialized.data)


from ..models import PrivateMessage


############################################## DC Changes ##############################################


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_messages(request):
    other_user_id = request.GET.get("user_id")

    if not other_user_id:
        return Response({"error": "user_id parameter is required"}, status=400)

    user = request.user

    messages = PrivateMessage.objects.filter(
        (
            Q(sender=user, receiver_id=other_user_id)
            | Q(sender_id=other_user_id, receiver=user)
        )
    ).order_by("timestamp")

    serialized = [
        {
            "id": msg.id,
            "sender_id": msg.sender.id,
            "sender": msg.sender.firstname,
            "receiver": msg.receiver.firstname,
            "message": msg.message,
            "timestamp": msg.timestamp.isoformat(),
        }
        for msg in messages
    ]

    return Response(serialized)

    ############################################## DC Changes ##############################################


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversation(request):
    user = request.user

    # Get all messages where the user is either the sender or receiver
    messages = PrivateMessage.objects.filter(Q(sender=user) | Q(receiver=user))

    # Group by conversation partner and get latest message
    latest_messages = {}
    for msg in messages.order_by("-timestamp"):
        chat_partner = msg.receiver if msg.sender == user else msg.sender

        if chat_partner.id not in latest_messages:
            latest_messages[chat_partner.id] = {
                "user_id": chat_partner.id,
                "firstname": chat_partner.firstname,
                "email": chat_partner.email,
                "latest_message": msg.message,
                "timestamp": msg.timestamp.isoformat(),
            }

    return Response(list(latest_messages.values()))


class UserWhistlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        property_id = request.data.get("property_id")
        
        if not property_id:
            return Response(
                {"error": "property_id is required"}, status=HTTP_400_BAD_REQUEST
            )

        # Check if property exists
        try:
            property_instance = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"error": "Property not found"}, status=HTTP_400_BAD_REQUEST
            )
        
        # Check if already in wishlist
        existing_wishlist = Whishlist.objects.filter(user = user, property_id = property_instance)
        if existing_wishlist.exists():
            existing_wishlist.delete()
            return Response(
                {"message": "Property removed from wishlist"}, status=HTTP_200_OK
            )

        # Create wishlist entry
        wishlist_data = {"user": user.id, "property": property_id}
        serializer = WhishlistInputSerializer(data=wishlist_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = request.user
        wishlist = Whishlist.objects.filter(user=user)
        serializer = WhishlistOutputSerializer(wishlist, many=True) 
        return Response(serializer.data, status=HTTP_200_OK)


# Add this endpoint for property-specific reviews
@api_view(["GET"])
@permission_classes([AllowAny])
def property_reviews(request): # this is the endpoint to get the reviews of the property
    property_id = request.GET.get("property_id")

    if not property_id:
        return Response(
            {"error": "property_id parameter is required"}, status=HTTP_400_BAD_REQUEST
        )

    try:
        # Check if property exists
        property_instance = Property.objects.get(id=property_id)
    except Property.DoesNotExist:
        return Response({"error": "Property not found"}, status=HTTP_400_BAD_REQUEST)

    # Get reviews for this property
    reviews = Review.objects.filter(property=property_instance).select_related("user")

    # Serialize with user details
    data = [
        {
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "user": {
                "id": review.user.id,
                "name": f"{review.user.firstname} {review.user.lastname}".strip(),
                "thumbnail": request.build_absolute_uri(review.user.thumbnail.url)
                if review.user.thumbnail
                else None,
            },
        }
        for review in reviews
    ]

    return Response(data, status=HTTP_200_OK)

class UserLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        lat = request.data.get("latitude")
        lon = request.data.get("longitude")
        

        if lat and lon:
            try:
                user.current_location = Point(float(lon), float(lat))
                user.save()
                return Response({"status": "success"}, status=HTTP_200_OK)
            except ValueError:
                return Response(
                    {"error": "Invalid latitude or longitude."},
                    status=HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"error": "latitude and longitude are required."},
                status=HTTP_400_BAD_REQUEST,
            )


from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm
from .serializers import CustomPasswordResetConfirmSerializer, CustomPasswordResetSerializer
from django_rest_passwordreset.models import ResetPasswordToken
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .utils import send_password_reset_email

class CustomPasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Send email with reset link
            send_password_reset_email(email, user, token)
            
            return Response({'status': 'OK'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # Don't reveal if email exists for security
            return Response({'status': 'OK'}, status=status.HTTP_200_OK)

class CustomPasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('new_password')
        
        if not uid or not token or not password:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            from django.utils.http import urlsafe_base64_decode
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
            
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"success": "Password has been reset"}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# for notification system .......
# ReservePropertyAPIView

from ..models import Reservation
from .utils import create_notification

from .utils import create_notification

class ReservePropertyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        property_id = request.data.get("property_id")

        if not property_id:
            return Response(
                {"error": "property_id is required"}, status=HTTP_400_BAD_REQUEST
            )

        # Check if property exists
        try:
            property_instance = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"error": "Property not found"}, status=HTTP_400_BAD_REQUEST
            )

        # Check if the user already has a reservation for this property
        existing_reservation = Reservation.objects.filter(
            user=user,
            property=property_instance,
            reserved=True
        ).first()

        if existing_reservation:
            # Cancel the reservation
            existing_reservation.reserved = False
            existing_reservation.save()
            
            # Update property availability
            property_instance.is_available = True
            property_instance.save()

            # Notify the reserver about cancellation
            create_notification(
                recipient=user,
                sender=None,
                message=f"You have canceled your reservation for {property_instance.title}.",
                property_instance=property_instance,
            )

            return Response(
                {"message": "Reservation canceled successfully."}, status=HTTP_200_OK
            )
        else:
            # Check if the property is already reserved
            if not property_instance.is_available:
                return Response(
                    {"error": "Property is already reserved by another user."},
                    status=HTTP_400_BAD_REQUEST,
                )
                
            # Create a new reservation
            Reservation.objects.create(
                user=user,
                property=property_instance,
                reserved=True
            )
            
            # Update property availability
            property_instance.is_available = False
            property_instance.save()

            # Notify the host
            create_notification(
                recipient=property_instance.host,
                sender=user,
                message=f"{user.firstname} {user.lastname} has reserved your property: {property_instance.title}.",
                property_instance=property_instance,
            )

            # Notify the reserver
            create_notification(
                recipient=user,
                sender=None,
                message=f"You have successfully reserved {property_instance.title}.",
                property_instance=property_instance,
            )

            return Response(
                {"message": "Property reserved successfully."}, status=HTTP_200_OK
            )
        
    
class UserReservationsView(ListAPIView):
    """Returns all properties reserved by the authenticated user"""
    
    serializer_class = PropertyModelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get all active reservations for this user
        reservations = Reservation.objects.filter(
            user=user,
            reserved=True
        ).values_list('property_id', flat=True)
        
        # Return the properties from those reservations
        return Property.objects.filter(
            id__in=reservations
        ).select_related("host").prefetch_related("images")

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)

            return Response(
                {
                    "status": "success",
                    "count": queryset.count(),
                    "properties": serializer.data,
                },
                status=HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)}, status=HTTP_400_BAD_REQUEST
            )

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all notifications for the authenticated user.
        """
        notifications = Notification.objects.filter(recipient=request.user).order_by("-created_at")
        data = []
        
        for notification in notifications:
            sender_data = None
            if notification.sender:
                sender_data = {
                    "id": notification.sender.id,
                    "name": f"{notification.sender.firstname} {notification.sender.lastname}".strip()
                }
                
            property_data = None
            if notification.property:
                property_data = {
                    "id": notification.property.id,
                    "title": notification.property.title
                }
                
            data.append({
                "id": notification.id,
                "sender": sender_data,
                "property": property_data,
                "message": notification.message,
                "is_read": notification.is_read,
                "created_at": notification.created_at,
            })
            
        return Response(data, status=HTTP_200_OK)

class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, notification_id):
        """
        Mark a notification as read.
        """
        try:
            notification = Notification.objects.get(
                id=notification_id, recipient=request.user
            )
            notification.is_read = True
            notification.save()
            return Response({"status": "success"}, status=HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"}, status=HTTP_400_BAD_REQUEST
            )