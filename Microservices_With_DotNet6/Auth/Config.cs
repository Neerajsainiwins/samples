using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AuthIdentityServer
{
    public static class Config
    {
        public static IEnumerable<ApiResource> GetResources() => new List<ApiResource> {
            new ApiResource("Admin"),
            new ApiResource("CRM"),
            new ApiResource("AUTH"),
            new ApiResource(IdentityServerConstants.LocalApi.ScopeName),
        };

        public static IEnumerable<IdentityResource> GetIdentityResources() => new List<IdentityResource> {
            new IdentityResources.OpenId(),
            new IdentityResource
            {
                Name = "profile_pic",
                UserClaims = new List<string> { "profile_pic" }
            }
        };

        public static IEnumerable<Client> GetClients() => new List<Client> {
            new Client {
                ClientId="client_secret_mvc",
                ClientSecrets={new Secret ("secret") },
                AllowedGrantTypes=GrantTypes.Code,
                AllowedScopes={
                     "Admin",
                     "CRM",
                     IdentityServerConstants.StandardScopes.OpenId,
                     IdentityServerConstants.StandardScopes.Profile
                 },
                RedirectUris={ "http://localhost:3000/signin-oidc" },
                PostLogoutRedirectUris={ "http://localhost:3000/signout-oidc" },
                AllowOfflineAccess = true,
                RequireConsent = false,
            },
            new Client {
                    ClientId = "react",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireClientSecret = false,

                    RedirectUris = { "http://localhost:3000" },
                    PostLogoutRedirectUris = { "http://localhost:3000" },

                    AllowedScopes = {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.LocalApi.ScopeName,
                         "profile_pic",
                        "Admin",
                        "CRM",
                        "AUTH"
                    },

                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowAccessTokensViaBrowser = true,
                    RequireConsent = false,
                },
        };

        public static List<TestUser> GetUsers() =>
            new List<TestUser>
            {
                new TestUser
                {
                    SubjectId = "2345tyergf-073C-434B-AD2D-A3932222DABE",
                    Username = "mehmet",
                    Password = "swn",
                    Claims = new List<Claim>
                    {
                        new Claim(JwtClaimTypes.GivenName, "mehmet"),
                        new Claim(JwtClaimTypes.FamilyName, "ozkaya")
                    }
                }
            };
    }
}
