from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginForm(forms.Form):
    email_address = forms.CharField(label='email_address')
    password = forms.CharField(label='password')

class SignUpForm(forms.Form):
    email_address = forms.CharField(label='email_address')
    first_name = forms.CharField(label='first_name')
    last_name = forms.CharField(label='last_name')
    raw_password = forms.CharField(label='raw_password')

    def save(self):
        User.first_name = self.cleaned_data['first_name']
        User.last_name = self.cleaned_data['last_name']
        User.email_address = self.cleaned_data['email_address']
        
        User.save()
        
