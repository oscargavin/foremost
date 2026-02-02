"use client";

import { useEffect } from "react";
import { Container, Section } from "@/components/layout";
import { Button, Heading, Text } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
  }, [error]);

  return (
    <Section className="py-32">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <Heading as="h1" size="section" className="mb-4">
            Something went wrong
          </Heading>
          <Text variant="bodyLarge" mono className="text-foreground-muted mb-8">
            We encountered an unexpected error. Please try again.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} size="lg">
              Try again
            </Button>
            <Button href="/" variant="secondary" size="lg">
              Return home
            </Button>
          </div>
          {error.digest && (
            <p className="mt-8 text-sm text-foreground-subtle font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
