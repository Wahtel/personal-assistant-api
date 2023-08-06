import 'dotenv/config'
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const {
  GOOGLE_CLOUD_TYPE,
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_PRIVATE_KEY_ID,
  GOOGLE_CLOUD_PRIVATE_KEY,
  GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_CLIENT_ID,
  GOOGLE_CLOUD_AUTH_URI,
  GOOGLE_CLOUD_TOKEN_URI,
  GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
  GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
  GOOGLE_CLOUD_UNIVERSE_DOMAIN
} = process.env;
const googleCouldCredentials = {
  type: GOOGLE_CLOUD_TYPE,
  project_id: GOOGLE_CLOUD_PROJECT_ID,
  private_key_id: GOOGLE_CLOUD_PRIVATE_KEY_ID,
  private_key: GOOGLE_CLOUD_PRIVATE_KEY,
  client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
  client_id: GOOGLE_CLOUD_CLIENT_ID,
  auth_uri: GOOGLE_CLOUD_AUTH_URI,
  token_uri: GOOGLE_CLOUD_TOKEN_URI,
  auth_provider_x509_cert_url: GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
  universe_domain: GOOGLE_CLOUD_UNIVERSE_DOMAIN
};

const textToSpeechClient = new TextToSpeechClient({
  credentials: googleCouldCredentials
});

export default textToSpeechClient;
