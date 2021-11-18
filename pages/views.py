from django.http.response import HttpResponse
from django.shortcuts import render, redirect
from django.http import request
from django.contrib.auth.models import User,auth
from django.contrib import messages
import pyrebase
import smtplib,ssl

config={
            "apiKey": "AIzaSyCsPgZdy5KRLb9vER3Kqdt9cSk25YCGoQQ",
            "authDomain": "helloworld-7c31b.firebaseapp.com",
            "databaseURL":"https://helloworld-7c31b-default-rtdb.firebaseio.com/",
            "projectId": "helloworld-7c31b",
            "storageBucket": "helloworld-7c31b.appspot.com",
            "messagingSenderId": "853886361",
            "appId": "1:853886361:web:102ea4e7f413e17eb47f08",
            "measurementId": "G-BY1B6903EX"
        }
firebase=pyrebase.initialize_app(config)
storage=firebase.storage()
db=firebase.database()
# Create your views here.
def index(request):
    if(not request.user.is_authenticated):
        return redirect('login')
    else:
        return render(request,'index.html')
def homepage(request):
    return render(request,'landing.html')

def register(request):
    if(request.user.is_authenticated):
        return redirect('index')
    else:
        if(request.method=='POST' and  request.POST['username']!="" and  request.POST['email']!="" and  request.POST['pass1']!="" and  request.POST['pass2']!=""):
            email=request.POST['email']
            e=email.lower()
            
            username=request.POST['username']
            pass1=request.POST['pass1']
            pass2=request.POST['pass2']
            db.child('users').push({'username':username,'email':email})

            if(pass1==pass2):
                if(User.objects.filter(email=email).exists()):
                    messages.info(request,"Email Already Used")
                    return redirect('register')
                elif(User.objects.filter(username=username).exists()):
                    messages.info(request,"Username Already Used")
                    return redirect('register')
                elif(len(pass1)<8):
                    messages.info(request,"Minimum length of the password is 8 characters !!!")
                    return redirect('register')
                else:
                    user=User.objects.create_user(email=email,username=username,password=pass1)
                    user.save()
                    return redirect('login')
            else:
                messages.info(request,"Passwords not Same")
                return redirect('register')
        else:
            return render(request,'signup.html')


def login(request):
    if(request.user.is_authenticated):
        return redirect('index')
    else:
        if(request.method=='POST'):
            username=request.POST['username']
            password=request.POST['pass1']
            
            user=auth.authenticate(username=username,password=password)
            if user:
                auth.login(request,user)
                messages.info(request,f'Welcome {username}')
                return redirect('index')
            else:
                messages.info(request,'Invalid Username/Password')
                return redirect('login')
        else:
            return render(request,'signin.html')

def logout(request):
    auth.logout(request)
    return redirect('index')

def listen(request):
    from . import speech
    if(request.method=='GET'):
        messages.info(request,speech.user_command)
        return redirect('index')
    else:
        return render(request,'index.html')

def upload(request):
    if(request.user.is_authenticated):
        if(request.method=='POST'):
            my_file=request.FILES['fupload']
            pt='files/'+my_file.name
            storage.child(pt).put(my_file)
            return redirect('register')
        else:
            return render(request,'upindex.html')
    else:
        return redirect('login')

def send_email(request):
    '''yag = yagmail.SMTP('users.spotlight@gmail.com','q#cT@q8ipHiKo@Eb')

    contents = [request.POST['email'],request.POST['message']]

    yag.send('maheshvanamrms@gmail.com', 'Suggestion from '+request.POST['name'], contents)'''
    context = ssl.create_default_context()
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login('users.spotlight@gmail.com', 'q#cT@q8ipHiKo@Eb')
        server.sendmail('users.spotlight@gmail.com','queries.spotlight@gmail.com',
                        request.POST['message'])
        server.close()
    return redirect('login')