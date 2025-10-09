"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import AuthHeader from "./auth-header";
import BackButton from "./back-button";

interface CardWrapperProps {
  label: string;
  title: string;
  backButtonHref?: string;
  backButtonLabel?: string;
  children: React.ReactNode;
}

const CardWrapper = ({
  label,
  title,
  backButtonHref,
  backButtonLabel,
  children,
}: CardWrapperProps) => {
  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-md">
        <CardHeader>
          <AuthHeader label={label} title={title} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        {backButtonLabel && backButtonHref && (
          <CardFooter className="justify-center">
            <BackButton label={backButtonLabel} href={backButtonHref} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CardWrapper;
