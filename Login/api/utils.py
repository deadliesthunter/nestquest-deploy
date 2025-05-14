# utils.py
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_password_reset_email(email, user, token):
    # Get a URL-safe base64 encoded string of the user's ID
    from django.utils.http import urlsafe_base64_encode
    from django.utils.encoding import force_bytes
    
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Create deep link with both token and uid
    reset_url = f"nestquest://reset-password?token={token}&uid={uid}"
    
    # Plain text email is simpler for mobile apps
    email_body = f"""
    Hello,
    
    You requested a password reset for your NestQuest account.
    
    Please click this link to reset your password: {reset_url}
    
    If you didn't request this, you can ignore this email.
    
    Thanks,
    NestQuest Team
    """
    
    from django.core.mail import send_mail
    send_mail(
        "Reset Your NestQuest Password",
        email_body,
        "noreply@nestquest.com",
        [email],
        fail_silently=False
    )



def create_notification(recipient, sender, message, property_instance=None):
    """
    Create a notification for a user.
    
    Args:
        recipient: User who will receive the notification
        sender: User who triggered the notification (can be None)
        message: Notification message text
        property_instance: Property related to this notification
    """
    from ..models import Notification
    
    notification = Notification.objects.create(
        recipient=recipient,
        sender=sender,
        property=property_instance,
        message=message,
        is_read=False
    )
    return notification