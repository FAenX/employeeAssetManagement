from django.views.generic import ListView
from django.shortcuts import render_to_response
from django.shortcuts import render, reverse
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.core import serializers
import json
from django.db import transaction


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from frontend.tokens import account_activation_token

from django.core.mail import EmailMessage

# Create your views here.
from company_assets.models import Asset, AssetManagement
from users.models import EmployeeProfile

#get user model
User = get_user_model()

class DashboardView(ListView):
    template_name = 'employer_dashboard.html'

    def get_queryset(self):
        return EmployeeProfile.objects.filter(created_by=self.request.user.id)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)        
                   
        employees = EmployeeProfile.objects.filter(created_by=self.request.user.id)
        context['employees'] = employees

        my_assets = AssetManagement.objects.filter(given_to=self.request.user.id)
        context['assets']= my_assets
        return context
       

# accounts
class LoginView(View):
    ''' login '''
    def post(self, request):
        data = json.loads(self.request.body)
        email = data['email']
        password = data['password']      
        user = authenticate(email=email, password=password)
        print(user)
        try:
            if user:
                if user.is_active:
                    login(request, user)
                    return JsonResponse(200, safe=False)
                else:
                    return JsonResponse("Your account was inactive.", safe=False)
            
            elif not user and User.objects.get(email=data['email']):
                return JsonResponse("Your account is inactive. Please activate your account by following the link in your email", safe=False)

        except:
            print("Someone tried to login and failed.")
            print("They used username: {} and password: {}".format(email, password))
            return JsonResponse("Invalid login details given", safe=False)
                
#logout view
class logoutView(View):
    '''logout view'''
    def get(self, request):
        logout(self.request)
        return HttpResponse('200')

#sign up view
class CreateEmployee(View):
    ''' sign up '''
    @transaction.atomic
    def post(self, request):
        data = json.loads(self.request.body)
        print(data)
        print(self.request.user.id)
        try:
            user = User.objects.create_user(email=data['email'], password=data['password'], 
                                            first_name=data['first_name'], last_name=data['last_name'], 
                                            is_employee = True, is_active=False)      
            
            user_profile = EmployeeProfile.objects.get_or_create(user=user, created_by=self.request.user.id)
            #print(user_profile)
            current_site = get_current_site(self.request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string('email_template.html', {
                'user': user,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':account_activation_token.make_token(user),
            })
            to_email = data['email']
            email = EmailMessage(
                        mail_subject, message, to=[to_email]
            )
            email.send()
            return JsonResponse(200, safe=False)

        except Exception as e:
            print('Exception:', e)            
            return JsonResponse(str(e), safe=False)

#employer sign up view
class CreateEmployer(View):
    ''' sign up '''
    @transaction.atomic
    def post(self, request):
        data = json.loads(self.request.body)
        print(data)
        print(self.request.user.id)

        try:
            user = User.objects.create_user(email=data['email'], password=data['password'], 
                                            first_name=data['first_name'], last_name=data['last_name'], 
                                            is_employer = True, is_active=False)
            
            #return HttpResponse(200)
            current_site = get_current_site(self.request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string('email_template.html', {
                'user': user,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':account_activation_token.make_token(user),
            })
            to_email = data['email']
            email = EmailMessage(
                        mail_subject, message, to=[to_email]
            )
            email.send()
            return JsonResponse(200, safe=False)
        
        except Exception as e:
            print('Exception:', e)            
            return JsonResponse(str(e), safe=False)

#activate user endpoint
class Activate(View):
    '''activate'''
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            login(request, user)
            # return redirect('home')
            return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
        else:
            return HttpResponse('Activation link is invalid!')

#password reset veiw
class PasswordRest(View):
    ''' reset user password '''



#return employee basic information
class EmployeeView(View):
    ''' view employee personal details '''
    def post(self, request):
        employee_profile_id = json.loads(self.request.body)['employee_id']        
        employee = User.objects.filter(employeeprofile=employee_profile_id)        
        print('------')
        serialized_employee = serializers.serialize('json', employee)
        print(serialized_employee)

        return JsonResponse(serialized_employee, safe=False)



#return assets given to the employee
class EmployeeAssetsView(View):
    ''' view assets given to employee '''
    def post(self, request):
        employee_profile_id = json.loads(self.request.body)['employee_id']        
        employee = User.objects.filter(employeeprofile=employee_profile_id)
        assets = AssetManagement.objects.filter(user=employee[0])
        
        serialized_assets = serializers.serialize('json', assets)
        print(serialized_assets)

        return JsonResponse(serialized_assets, safe=False)


        
