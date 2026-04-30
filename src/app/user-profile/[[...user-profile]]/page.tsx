import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <UserProfile 
          path="/user-profile" 
          routing="path"
          appearance={{
            baseTheme: dark,
            variables: {
              colorBackground: '#0a0a0a',
              colorInputBackground: '#111111',
              colorText: '#ffffff',
              colorTextSecondary: '#a1a1aa',
              colorPrimary: '#ffffff',
              colorInputText: '#ffffff',
              colorDanger: '#ef4444',
              borderRadius: '0.75rem',
            },
            elements: {
              rootBox: "w-full shadow-2xl border border-white/5 rounded-2xl overflow-hidden mx-auto",
              card: "shadow-none border-none w-full",
              navbar: "border-r border-white/5 bg-transparent",
              headerTitle: "text-2xl font-black tracking-tight",
              profileSectionTitleText: "text-lg font-bold",
              formButtonPrimary: "text-black font-bold",
              formFieldInput: "border-white/10 focus:border-white/20 transition-all",
              footer: "hidden", // Clean up the footer
              breadcrumbs: "hidden", // Remove breadcrumbs
            }
          }}
        />
      </div>
    </div>
  );
}
