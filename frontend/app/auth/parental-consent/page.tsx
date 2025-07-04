"use client"

export default function ParentalConsentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Parental Consent for DAWN AI
          </h2>
          <p className="mt-4 text-center text-md text-gray-700">
            In compliance with the Children's Online Privacy Protection Act (COPPA), we require verifiable parental consent for users under the age of 13.
          </p>
        </div>
        <div className="prose prose-blue max-w-none text-gray-800">
          <h4>How it Works:</h4>
          <ol>
            <li>
              When a child under 13 attempts to register, a parental consent request will be sent to the parent/guardian's email address provided during sign-up.
            </li>
            <li>
              The parent/guardian must click the verification link in the email to access and complete the consent form.
            </li>
            <li>
              Once consent is provided, the child's account will be activated, and they can log in to the DAWN AI platform.
            </li>
          </ol>
          <h4>Why we need this:</h4>
          <p>
            This process ensures we protect children's privacy and comply with federal regulations. We are committed to creating a safe and secure learning environment for all our users.
          </p>
          <p>
            If you are a parent or guardian and have not received a consent email, please check your spam folder or contact our support team for assistance.
          </p>
        </div>
        <div className="text-center mt-6">
            <a href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              &larr; Back to Sign Up
            </a>
        </div>
      </div>
    </div>
  )
} 