import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Admin } from 'src/admin/entities/admin.entity';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendadminConfirmation(admin: Admin, password) {
    const url = "http://localhost:3000/";

    const send = await this.mailerService.sendMail({
      to: admin.emailaddress,
      subject: "Welcome to AMS ",
      
      text:`Dear ${admin.firstname} ${admin.lastname},
        An account has been created for you.  Your login details are as follows:
        email: ${admin.emailaddress},
        password: ${password},
        ${url},`
    });
    return send;
  }

  async sendresetPassword(admin: Admin, password: string) {
    const url = 'http://localhost:3000/auth/login';
    const send = await this.mailerService.sendMail({
      to: admin.emailaddress,
      subject: 'Your AMS password has been reset',
      text: `Dear ${admin.firstname} ${admin.lastname},

Your password has been reset. Use the temporary password below to sign in, then change it from Settings → Security.

Email: ${admin.emailaddress}
Temporary password: ${password}

Sign in: ${url}

If you did not request this, please contact your administrator.`,
    });
    return send;
  }
}
