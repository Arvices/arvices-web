import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface OnboardingConfirmationProps {
  onGoToDashboard: () => void;
}

export function OnboardingConfirmation({
  onGoToDashboard,
}: OnboardingConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Arvices
            </h1>
            <p className="text-muted-foreground">
              Join our service provider network
            </p>
          </div>

          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          <Card className="text-left">
            <CardContent className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl mb-4">Thank You!</h2>
                <h3 className="text-xl text-muted-foreground mb-2">
                  Your Account is Under Review
                </h3>
                <p className="text-muted-foreground">
                  Our team is reviewing your details. You'll be notified once
                  your profile goes live.
                </p>
              </motion.div>

              {/* Verification Steps */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4 mb-8"
              >
                <h4 className="text-lg mb-4">What happens next?</h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="text-blue-900 mb-1">
                        Document Verification
                      </h5>
                      <p className="text-blue-800 text-sm">
                        Our team reviews your ID and business documents (1-2
                        business days)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="text-yellow-900 mb-1">Profile Review</h5>
                      <p className="text-yellow-800 text-sm">
                        We verify your service details and portfolio samples
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="text-green-900 mb-1">Go Live!</h5>
                      <p className="text-green-800 text-sm">
                        Start receiving job requests from clients in your
                        service areas
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mb-8"
              >
                <div className="w-48 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-6xl">📋</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Documents being verified by our team
                </p>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-gray-50 rounded-lg p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="mb-1">
                      <strong>Estimated review time:</strong> 1-3 business days
                    </p>
                    <p className="text-muted-foreground">
                      We'll send updates to your email. Check your spam folder
                      if you don't hear from us.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center"
              >
                <Button
                  onClick={onGoToDashboard}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  You can track your verification status from your dashboard
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
