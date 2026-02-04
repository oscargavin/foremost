import { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import { Button, Heading, Text } from "@/components/ui";
import { FadeIn } from "@/components/motion";

export const metadata: Metadata = {
  title: "Page Not Found | Foremost",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <Section className="py-32">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <p className="font-mono text-sm text-foreground-muted mb-4">404</p>
            <Heading as="h1" size="section" className="mb-4">
              Page not found
            </Heading>
            <Text variant="bodyLarge" mono className="text-foreground-muted mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/" size="lg">
                Return home
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-2"
                >
                  <path
                    d="M3.333 8h9.334M8.667 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Contact us
              </Button>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
