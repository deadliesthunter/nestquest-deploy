from django.urls import path, include
from rest_framework import routers
from .views import (
    UserViewSet,
    LoginAPIView,
    SignupAPIView,
    PublicFeedView,
    HostPropertiesView,
    CreatePropertyView,
    UserDetailView,
    search_users,
    search_messages,
    conversation,
    UserWhistlistView,
    search_property,
    ReviewAPIView,
    property_reviews,
    UserLocationView,
    CustomPasswordResetView,
    CustomPasswordResetConfirmView,
    UserDetailByIdView,
    ReservePropertyView,
    NotificationListView,
    NotificationMarkReadView,
    UserReservationsView,
   
)

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

urlpatterns = [
    # Authentication
    path("login/", LoginAPIView.as_view(), name="api_login"),
    path("signup/", SignupAPIView.as_view(), name="api_signup"),
    path('password-reset/', CustomPasswordResetView.as_view(), name='password-reset'),
    path('password-reset/confirm/', CustomPasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # User-related endpoints
    path("user/location/", UserLocationView.as_view(), name="user_location"), # expects parameter as get request
    path("user/", UserDetailView.as_view(), name="user_detail"),  # Keep only one of these
    path("user/<str:u_id>/", UserDetailByIdView.as_view(), name="user_detail_by_id"), #expects userid in url
    
    path("users/search/", search_users, name="search_users"),
    
    # Property-related endpoints
    path("properties/feed/", PublicFeedView.as_view(), name="public_feed"),
    path("properties/host/", HostPropertiesView.as_view(), name="host_properties"),
    path("properties/create/", CreatePropertyView.as_view(), name="create_property"),
    path("properties/search/", search_property, name="search_property"),
    path("properties/review/", ReviewAPIView.as_view(), name="review"),  # Fixed typo (propreties->properties) 
    path("properties/getreviews/", property_reviews, name="property_reviews"),#expects parameter as get request
    
    # Wishlist
    path("wishlist/", UserWhistlistView.as_view(), name="wishlist"),  # Fixed spelling (whishlist->wishlist)
    
    # Messaging
    path("messages/search/", search_messages, name="search_messages"),
    path("messages/conversation/", conversation, name="conversation"),
    
    # Router URLs (keep at bottom)
    path("", include(router.urls)),

     path('properties/reservation/', ReservePropertyView.as_view(), name='reserve_property'),
    path('properties/user-reservations/', UserReservationsView.as_view(), name='user_reservations'),
    
    # Notification endpoints
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications/<int:notification_id>/read/', NotificationMarkReadView.as_view(), name='mark_notification_read'),
]