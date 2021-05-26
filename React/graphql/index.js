import gql from 'graphql-tag';

/************************************************
  USER
 ************************************************/

export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      _id
      email
      phoneNumber
      firstName
      organizationContextId
      currentOrganizationRole
      lastName
      couponIds
      visitIds
    }
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo($email: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!) {
    updateUserInfo(email: $email, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber) {
      _id
      email
      phoneNumber
      firstName
      organizationContextId
      currentOrganizationRole
      lastName
      couponIds
      visitIds
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register($email: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!, $password: String!) {
    register(email: $email, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, password: $password) {
      token
    }
  }
`;

export const PASSWORD_LOGIN = gql`
  mutation passwordLogin($email: String!, $password: String!) {
    passwordLogin(email: $email, password: $password) {
      token
    }
  }
`;

export const PASSWORD_FORGOT = gql`
  mutation passwordForgot($email: String!) {
    passwordForgot(email: $email) {
      message
    }
  }
`;

export const PASSWORD_RESET = gql`
  mutation passwordReset($password: String!, $code: String!) {
    passwordReset(password: $password, code: $code) {
      message
      status
    }
  }
`;

export const PHONE_LOGIN = gql`
  mutation phoneLogin($email: String!, $phoneNumber: String!) {
    phoneLogin(email: $email, phoneNumber: $PhoneNumber) {
      token
    }
  }
`;

/************************************************
  ORGANIZATION
 ************************************************/

export const CREATE_ORGANIZATION = gql`
  mutation createOrganization($name: String!, $address: AddressInput, $logoUrl: String!, $posterImageUrl: String!) {
    createOrganization(name: $name, address: $address, logoUrl: $logoUrl, posterImageUrl: $posterImageUrl) {
      token
    }
  }
`;

export const GET_CURRENT_ORGANIZATION = gql`
  query getCurrentOrganization {
    getCurrentOrganization {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query getOrganization($organizationId: String!) {
    getOrganization(organizationId: $organizationId) {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
    }
  }
`;

export const GET_ORGANIZATION_LIST = gql`
  query getOrganizationList {
    getOrganizationList {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_INFO = gql`
  mutation updateOrganizationInfo($name: String!, $address: AddressInput, $logoUrl: String!, $posterImageUrl: String!) {
    updateOrganizationInfo(name: $name, address: $address, logoUrl: $logoUrl, posterImageUrl: $posterImageUrl) {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_CONFIGURATION = gql`
  mutation updateOrganizationConfiguration($configurations: OrganizationConfigurationsInput!) {
    updateOrganizationConfiguration(configurations: $configurations)  {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
    }
  }
`;

/************************************************
  ROLES
 ************************************************/

export const GET_ORGANIZATION_ROLES = gql`
  query getOrganizaationRoles {
    getOrganizationRoles {
      _id
      userId
      email
      organizationId
      acceptedAt
      accessLevel
      user {
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_USER_ROLES = gql`
  query getUserRoles {
    getUserRoles {
      _id
      userId
      email
      organizationId
      acceptedAt
      accessLevel
      user {
        firstName
        lastName
        email
      }
      organization {
        name
        logoUrl
      }
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation createRole($email: String!, $accessLevel: String!) {
    createRole(email: $email, accessLevel: $accessLevel) {
      _id
      userId
      email
      organizationId
      acceptedAt
      accessLevel
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation deleteRole($roleId: String!) {
    deleteRole(roleId: $roleId)
  }
`;

export const ACCEPT_ROLE = gql`
  mutation acceptRole($roleId: String!, $doesAccept: Boolean!) {
    acceptRole(roleId: $roleId, doesAccept: $doesAccept) {
      token
    }
  }
`;

/************************************************
  CONTACT
 ************************************************/

export const CREATE_CONTACT = gql`
  mutation createContact($phoneNumber: String!) {
    createContact(phoneNumber: $phoneNumber)
  }
`;

export const GET_CONTACTS = gql`
  query getContacts {
    getContacts {
      _id
      phoneNumber
      organizationId
    }
  }
`;

/************************************************
  Message
 ************************************************/

export const SEND_CUSTOM_TEXT = gql`
  mutation sendCustomText($phoneNumber: String!, $message: String!, $mediaUrl: String) {
    sendCustomText(phoneNumber: $phoneNumber, message: $message, mediaUrl: $mediaUrl)
  }
`;

export const SEND_WELCOME_TEXT = gql`
  mutation sendWelcomeText {
    sendWelcomeText
  }
`;

export const SEND_PHONE_CODE = gql`
  mutation sendPhoneCode($phoneNumber: String!, $organizationId: String) {
    sendPhoneCode(phoneNumber: $phoneNumber, organizationId: $organizationId)
  }
`;

export const VERIFY_PHONE_CODE = gql`
  mutation verifyPhoneCode($phoneNumber: String!, $phoneCode: String!, $organizationId: String) {
    verifyPhoneCode(phoneNumber: $phoneNumber, phoneCode: $phoneCode organizationId: $organizationId) {
      token
    }
  }
`;

export const CREATE_REFERENCE = gql`
  mutation createReference($organizationId: String!) {
    createReference(organizationId: $organizationId) {
      _id
      userId
      organizationId
      createdAt
    }
  }
`;

/************************************************
  Message
 ************************************************/

export const GET_REFERENCE_BY_ID = gql`
  query getReferenceById($referenceId: String!) {
    getReferenceById(referenceId: $referenceId) {
      _id
      userId
      organizationId
      createdAt
    }
  }
`;

export const GET_REFERENCE = gql`
  query getReference($organizationId: String!) {
    getReference(organizationId: $organizationId) {
      _id
      userId
      organizationId
      createdAt
    }
  }
`;

/************************************************
  Coupon
 ************************************************/

export const CREATE_COUPON = gql`
  mutation createCoupon($referenceId: String!, $couponParentType: String!) {
    createCoupon(referenceId: $referenceId, couponParentType: $couponParentType) {
      _id
      userId
      amount
      referenceId
      activationExpiration
      redemptionExpiration
      acceptedAt
      redeemedAt
      type
    }
  }
`;

export const GET_COUPON_BALANCE = gql`
  query getCouponBalance($organizationId: String!) {
    getCouponBalance(organizationId: $organizationId)
  }
`;

export const GET_COUPON_EXPIRATION = gql`
  query getCouponExpiration($organizationId: String!) {
    getCouponExpiration(organizationId: $organizationId) {
      expirationTime
      expirationAmount
    }
  }
`;
