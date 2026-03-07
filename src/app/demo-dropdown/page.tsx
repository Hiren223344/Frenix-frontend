import { UserDropdown } from "@/components/ui/user-dropdown";

export default function DemoOne() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <UserDropdown user={{ email: 'demo@frenix.io' }} />
        </div>
    );
}
