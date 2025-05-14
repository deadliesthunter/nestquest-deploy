from django.contrib import admin
from .models import User, Property, PropertyImage


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    filter_horizontal = ("images",)


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ("image", "uploaded_at")


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "firstname", "lastname", "phone", "is_active", "is_staff"]
    search_fields = ["email", "firstname", "lastname", "phone"]
