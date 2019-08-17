from django.views.generic import TemplateView
from django.shortcuts import render_to_response
from django.shortcuts import render, reverse
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login


import json

# Create your views here.

from company_assets.models import Asset
from ..forms import SignUpForm, LoginForm

#index view
class IndexView(TemplateView):
    template_name = 'index.html'


class LoginView(View):
    ''' login '''
    def post(self, request):
        form = LoginForm(self.request.POST) 

        if form.is_valid(): 
            email = form.cleaned_data.get('email_address')
            password = form.cleaned_data.get('password') 
            print(password)         
            user = authenticate(email=email, password=password)
            if user:
                if user.is_active:
                    login(request,user)
                    return HttpResponse(200)
                else:
                    return HttpResponse("Your account was inactive.")
            else:
                print("Someone tried to login and failed.")
                print("They used username: {} and password: {}".format(email,password))
                return HttpResponse("Invalid login details given")

class SignUpView(View):
    ''' sign up '''
    def post(self, request):
        form = SignUpForm(self.request.POST)
        print(form)
        if form.is_valid():
            new_user = form.save()
            new_user.is_employee = True
            new_user.save()
            return HttpResponse(200)
        else:
            return HttpResponse("Invalid details given")





class EmployerDashboardView(TemplateView):
    template_name = 'employer_dashboard.html'
    model = Asset






