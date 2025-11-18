import { EmailService } from '../services/email.service';
import nodemailer from 'nodemailer';

jest.mock('nodemailer'); 

describe('EmailService', () => {
  let emailService: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
  sendMailMock = jest.fn((message, callback) => {
    
    callback(null, { accepted: ['test@example.com'] });
  
    return Promise.resolve({ accepted: ['test@example.com'] });
  });

  (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });

  emailService = new EmailService();
  });

  it('should send reset password email', async () => {
    const info = await emailService.sendResetPasswordEmail({
      toUser: 'test@example.com',
      hash: 'hash123'
    });

    
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(info.accepted).toContain('test@example.com');
  });
});