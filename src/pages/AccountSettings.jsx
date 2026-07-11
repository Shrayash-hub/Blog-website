import { useSelector } from "react-redux";
import { Container } from "../components";

function AccountSettings() {
    const userData = useSelector((state) => state.auth.userData);

    return (
        <div className="w-full bg-white pt-16 md:pt-20">
            {/* Hero section */}
            <div className="border-b border-stone-200 bg-stone-50 py-16">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                            Settings
                        </p>
                        <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl">
                            Account settings
                        </h1>
                    </div>
                </Container>
            </div>

            {/* Content section */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <div className="mx-auto max-w-2xl rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
                        <dl className="grid gap-6">
                            <div>
                                <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                    Name
                                </dt>
                                <dd className="mt-2 font-serif text-xl font-semibold text-stone-950">
                                    {userData?.name || "Not set"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                    Email
                                </dt>
                                <dd className="mt-2 font-serif text-xl font-semibold text-stone-950">
                                    {userData?.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                    Account ID
                                </dt>
                                <dd className="mt-2 break-all text-sm font-medium text-stone-700">
                                    {userData?.$id}
                                </dd>
                            </div>
                        </dl>
                        <p className="mt-8 rounded-sm bg-stone-100 px-4 py-3 text-sm leading-6 text-stone-600">
                            Password and email management features can be added through additional account API integration.
                        </p>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default AccountSettings;
