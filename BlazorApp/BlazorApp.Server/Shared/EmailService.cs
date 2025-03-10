﻿using System.Net.Mail;
using System.Text.RegularExpressions;
using BlazorApp.Shared.Models.User;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace BlazorApp.Server.Shared
{
    public class EmailService : IEmailService 
    {
        private readonly IConfiguration _configuration;
        private readonly IOptions<EmailSettings> _options;
        public EmailService(IConfiguration configuration, IOptions<EmailSettings> options)
        {
            _configuration = configuration;
            _options = options;
        }
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            string? fromEmail = _options.Value.SenderEmail;
            string? fromName = _options.Value.SenderName;
            string? apiKey = _options.Value.ApiKey;
            var sendGridClient = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail, fromName);
            var to = new EmailAddress(email);
            var plainTextContent = Regex.Replace(htmlMessage, "<[^>]*>", "");
            var msg = MailHelper.CreateSingleEmail(from, to, subject,
            plainTextContent, htmlMessage);
            var response = await sendGridClient.SendEmailAsync(msg);
        }
    }
}
