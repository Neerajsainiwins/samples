using IronXL;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Infrastucture.Repositories.Generic
{
    public class GenericFunctions
    {
        private readonly IConfiguration _configuration;
        public GenericFunctions(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// This method is used to send emails to the user.
        /// </summary>
        public bool SendEmail(string emailAddress, string subject, string templateId, string? link, string? role)
        {
            try
            {
                var client = new SendGridClient(_configuration["SendGridConfiguration:Key"]);
                SendGridMessage msg = new SendGridMessage()
                {
                    From = new EmailAddress(_configuration["SendGridConfiguration:Email"], _configuration["SendGridConfiguration:Name"]),
                    Subject = subject,
                    TemplateId = templateId
                };
                msg.AddTo(new EmailAddress(emailAddress));
                msg.SetTemplateData(new
                {
                    Role = role,
                    Link = link,
                });
                var result = client.SendEmailAsync(msg).GetAwaiter().GetResult();
                if (result.StatusCode == HttpStatusCode.OK || result.StatusCode == HttpStatusCode.Accepted)
                    return true;
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// This method is used to upload files into azure blob storage.
        /// </summary>
        public async Task<string> UploadAsync(IFormFile file, byte[] data, string mime)
        {
            try
            {
                CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_configuration["BlobConfig:StorageConnection"]);
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(_configuration["BlobConfig:Container"]);

                string uniqueFileName = GetUniqueFileName(file.FileName);

                if (await cloudBlobContainer.CreateIfNotExistsAsync())
                {
                    await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                }

                if (uniqueFileName != null && data != null)
                {
                    CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(uniqueFileName);
                    cloudBlockBlob.Properties.ContentType = mime;
                    await cloudBlockBlob.UploadFromByteArrayAsync(data, 0, data.Length);
                    var filePath = GetBlob(cloudBlobContainer.Name, uniqueFileName);
                    return filePath;
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
