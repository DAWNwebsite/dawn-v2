"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ParentalConsentPage() {
  const { data: session, update } = useSession()
  const [parentEmail, setParentEmail] = useState("")
  const [consentGiven, setConsentGiven] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleConsentSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      // In a real implementation, this would send an email to the parent
      // and require them to click a verification link
      
      // For now, we'll simulate the consent process
      if (consentGiven && parentEmail) {
        // Update the session to include parental consent
        await update({
          ...session,
          user: {
            ...session?.user,
            hasParentalConsent: true
          }
        })
        
        setMessage("Parental consent recorded successfully! You can now access the platform.")
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setMessage("Please provide parent email and confirm consent.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  if (!session?.user) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Parental Consent Required
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            To comply with COPPA regulations, we need parental consent for users under 13.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Why do we need parental consent?
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                The Children's Online Privacy Protection Act (COPPA) requires that we obtain 
                verifiable parental consent before collecting personal information from children under 13.
              </p>
              <p>
                This helps protect your child's privacy and ensures they have a safe learning experience.
              </p>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes("successfully") 
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleConsentSubmission} className="space-y-4">
            <div>
              <label htmlFor="parent-email" className="block text-sm font-medium text-gray-700">
                Parent/Guardian Email Address
              </label>
              <input
                id="parent-email"
                type="email"
                placeholder="Enter parent/guardian email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                We will send a verification email to this address.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="consent-checkbox"
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent-checkbox" className="ml-3 text-sm text-gray-700">
                  <strong>I am the parent or legal guardian of this child</strong> and I give my consent 
                  for them to use DAWN AI Study platform. I understand that:
                  <ul className="mt-2 ml-4 space-y-1 text-xs">
                    <li>• My child's learning progress will be tracked to provide personalized education</li>
                    <li>• Diagnostic assessments may be conducted to identify learning needs</li>
                    <li>• All data will be handled in compliance with COPPA and FERPA regulations</li>
                    <li>• I can withdraw consent at any time by contacting support</li>
                  </ul>
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading || !consentGiven || !parentEmail}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Submit Consent"}
              </button>
              
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Out
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              For questions about our privacy practices, please contact us at{" "}
              <a href="mailto:privacy@dawn.ai" className="text-blue-600 hover:text-blue-500">
                privacy@dawn.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 