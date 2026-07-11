import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import profileService from "../api/profileApi";
import { Button, Container, Input } from "../components";

function ProfileSettings() {
    const userData = useSelector((state) => state.auth.userData);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: "",
        bio: "",
        website: "",
        github: "",
        linkedin: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!userData?.$id) return;

        profileService.getProfile(userData.$id).then((profileData) => {
            setProfile(profileData);
            setForm({
                name: profileData?.name || userData.name || "",
                bio: profileData?.bio || "",
                website: profileData?.website || "",
                github: profileData?.github || "",
                linkedin: profileData?.linkedin || "",
            });
        });
    }, [userData]);

    const updateField = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        setMessage("");

        const saved = await profileService.upsertProfile({
            ...form,
            userID: userData.$id,
            avatar: profile?.avatar,
        });

        setProfile(saved);
        setMessage(saved ? "Profile saved." : "Add profile collection env/configuration to enable this feature.");
    };

    return (
        <div className="w-full bg-white pt-16 md:pt-20">
            {/* Hero section */}
            <div className="border-b border-stone-200 bg-stone-50 py-16">
                <Container>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="flex-1">
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
                                Your profile
                            </p>
                            <h1 className="font-serif text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl">
                                Public profile
                            </h1>
                            <p className="mt-5 text-base leading-7 text-stone-600">
                                Manage the author identity visitors see beside your posts.
                            </p>
                        </div>
                        <Link
                            to={`/authors/${userData?.$id}`}
                            className="inline-flex items-center justify-center rounded-sm border border-stone-200 bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-950 transition-colors duration-150 hover:bg-stone-50 active:scale-[0.98]"
                        >
                            View profile
                        </Link>
                    </div>
                </Container>
            </div>

            {/* Form section */}
            <div className="bg-stone-50 py-12">
                <Container>
                    <form
                        onSubmit={saveProfile}
                        className="mx-auto max-w-2xl rounded-sm border border-stone-200 bg-white p-8 shadow-sm"
                    >
                        <div className="grid gap-6">
                            <Input label="Display name" name="name" value={form.name} onChange={updateField} />
                            <div>
                                <label className="mb-2 inline-block text-sm font-semibold text-stone-700">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={updateField}
                                    rows="5"
                                    className="w-full rounded-sm border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition-colors focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                                    placeholder="Write a short author bio"
                                />
                            </div>
                            <Input label="Website" name="website" value={form.website} onChange={updateField} />
                            <Input label="GitHub" name="github" value={form.github} onChange={updateField} />
                            <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={updateField} />
                            {message && (
                                <p className="rounded-sm bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                    {message}
                                </p>
                            )}
                            <Button type="submit" className="w-full hover:bg-stone-700">
                                Save profile
                            </Button>
                        </div>
                    </form>
                </Container>
            </div>
        </div>
    );
}

export default ProfileSettings;
