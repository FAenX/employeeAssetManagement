from django.contrib import admin

# Register your models here.
from .models import Asset, AssetInstance, AssetManagement

admin.site.register(Asset)
admin.site.register(AssetInstance)
admin.site.register(AssetManagement)
