# coding: utf-8
import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.header import Header

# The email address of sender
username = 'maxichu50@gmail.com'
password = 'MAXICHu20131337@'
sender = 'maxichu50@gmail.com'
# receiver='XXX@126.com'

print(sys.argv)

if(sys.argv[1]):
    receiver = sys.argv[1]
else:
    print("No recipient address, please check")

if(sys.argv[2]):
    mission = sys.argv[2]
else:
    mission = "Unknown"

if(sys.argv[3]):
    student = sys.argv[3]
else:
    student = "Unknown"

if(sys.argv[4]):
    filepath=sys.argv[4]

subject = 'CS1101S linting report, Mission '+ mission + " , Student: "+ student


msg = MIMEMultipart('mixed')
msg['Subject'] = subject
msg['From'] = 'CS1101S <cs1101s@comp.nus.edu.sg>'
msg['To'] = receiver

#msg['To'] = ";".join(receiver)


text = subject
text_plain = MIMEText(text, 'plain', 'utf-8')
msg.attach(text_plain)


# sendimagefile = open(r'C:\Users\maxic\Desktop\test.png', 'rb').read()
# image = MIMEImage(sendimagefile)
# image.add_header('Content-ID', '<image1>')
# image["Content-Disposition"] = 'attachment; filename="test.png"'
# msg.attach(image)


# html = """
# <html>
#   <head></head>
#   <body>
#     <p>Hi!<br>
#        How are you?<br>
#        Here is the <a href="http://www.baidu.com">link</a> you wanted.<br>
#     </p>
#   </body>
# </html>


# text_html = MIMEText(html, 'html', 'utf-8')
# text_html["Content-Disposition"] = 'attachment; filename="texthtml.html"'
# msg.attach(text_html)




if(filepath):
    sendfile = open(filepath, 'rb').read()
    text_att = MIMEText(sendfile, 'base64', 'utf-8')
    text_att["Content-Type"] = 'application/octet-stream'
    text_att['Content-Disposition'] = 'attachment; filename= "report.pdf"'
    msg.attach(text_att)



smtp = smtplib.SMTP("smtp.gmail.com", 587)
smtp.set_debuglevel(1)

smtp.ehlo()  
smtp.starttls()
smtp.login(username, password)
smtp.sendmail(sender, receiver, msg.as_string())
smtp.quit()
