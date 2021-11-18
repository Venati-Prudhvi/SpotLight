"""spotlight URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pages.views import index,homepage,register,login,logout,listen,upload,send_email
import django
urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard',index,name='index'),
    path('',homepage,name='landing'),
    path('register',register,name='register'),
    path('login',login,name='login'),
    path('logout',logout,name='logout'),
    path('listen', listen,name='listen'),
    path('upload', upload,name='upload'),
    path('send_email',send_email,name='send_email')
]
