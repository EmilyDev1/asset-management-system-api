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

  async sendresetPassword(admin: Admin, password) {

    const send = await this.mailerService.sendMail({
      to: admin.emailaddress,
      subject: "Welcome to HRMS ",
      
      text:`Dear ${admin.firstname} ${admin.lastname},
        Your new password is: password: ${password},`
    });
    return send;
  }
}
