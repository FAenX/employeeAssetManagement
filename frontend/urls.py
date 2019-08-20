from django.urls import path
from frontend.views import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name="login"),
    path('signup/', views.SignUpView.as_view(), name="sign_up"),
    path('employer-dashboard/', views.EmployerDashboardView.as_view(),
         name='employer_dashboard'),
    path('employee-API/', views.EmployeeApiView.as_view(), name='employee_api'),

]
