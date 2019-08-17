from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import datetime
from django.utils.html import escape, mark_safe
from django.urls import reverse

from phonenumber_field.modelfields import PhoneNumberField


from utils.utils import profile_unique_slug_generator, user_unique_slug_generator


# Create your models here.

class UserManager(BaseUserManager):
    '''
    user manager
    '''
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given employee_id email, and password.
        """
        if not email:
            raise ValueError('The given email must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    '''
    user model
    '''

    email = models.EmailField(_('Email Address'), blank=False, unique=True)
    first_name = models.CharField(_('First Name'), max_length=50, blank=False)
    last_name = models.CharField(_('Last Name'), max_length=50, blank=False)
    is_employee = models.BooleanField('Employee', default=False)
    is_employer = models.BooleanField('Employer', default=False)
    slug = models.SlugField(unique=True)
                

    username = None

    objects = UserManager()
    #use email as username fields
    USERNAME_FIELD = 'email'
    #overwrite REQUIRED_FIELDS to empty
    REQUIRED_FIELDS = []

class EmployeeProfile(models.Model):
    '''
    developer profile model
    '''
    user = models.OneToOneField(
        User, related_name='employeeprofile', on_delete=models.CASCADE)
    slug = models.SlugField(max_length=40, unique=True)
    contact_number = PhoneNumberField(_('Contact Phone Number'),blank=True, null=True)
    created_by = models.ForeignKey('EmployerProfile', on_delete=models.CASCADE)

    def get_absolute_url(self):
        return reverse('employee_profile', kwargs={'slug': self.slug})
    

    #string represantation of the model
    def __str__(self):
        return f"{self.user.email}'s Profile"  # return users email

class EmployerProfile(models.Model):
    '''
    employer profile model
    '''
    user = models.OneToOneField(
        User, related_name='employerprofile', on_delete=models.CASCADE)
    contact_number = PhoneNumberField(_('Contact Phone Number'),blank=True, null=True)
    position = models.CharField(
        _('What is your position in the company'), max_length=40, default='')
    creation_date = models.DateTimeField(default=datetime.datetime.now)
    slug = models.SlugField(max_length=40, unique=True)
    number_of_employees = models.IntegerField()

    def get_absolute_url(self):
        return reverse('employer_profile', kwargs={'slug': self.slug})
    

    #string representation of the model
    def __str__(self):
        return f"{self.user.email}'s Profile"  # return users email


###########################
#pre_save conditions
#create slugs for models with slug field
############################
@receiver(pre_save, sender=EmployeeProfile)
def create_employee_profile_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = profile_unique_slug_generator(instance)

@receiver(pre_save, sender=EmployerProfile)
def create_employer_profile_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = profile_unique_slug_generator(instance)

@receiver(pre_save, sender=User)
def create_user_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = user_unique_slug_generator(instance)

###############
#post_save user profile
##############
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_employee:
            EmployeeProfile.objects.create(user=instance)
        elif instance.is_employer:
            EmployerProfile.objects.create(user=instance)
            
