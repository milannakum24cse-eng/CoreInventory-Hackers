import SignupForm from '../components/SignupForm';
import { Shield, Lock, Zap, Users } from 'lucide-react';

export default function SignupPage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: Lock,
      title: 'Private',
      description: 'Your information is encrypted and never shared',
    },
    {
      icon: Zap,
      title: 'Fast',
      description: 'Get started instantly with our quick setup process',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of users worldwide',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Join Our Community
          </h1>
          <p className="text-lg text-gray-600">
            Create your account in seconds and start your journey today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <SignupForm />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Join Us?</h2>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>Username (Login ID) - for account identification</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>Valid email address - for account recovery and notifications</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>Strong password - minimum 8 characters for security</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>Password confirmation - to prevent typos</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">After Signup</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Once you create your account, you'll receive a verification email. Verify your email to unlock full access to all features and start collaborating with our community.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            By signing up, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
