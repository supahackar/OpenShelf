export default function AboutPage() {
    return (
        <div className="container py-8 md:py-12">
            <div className="mx-auto max-w-[58rem] space-y-6">
                <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                    About OpenShelf
                </h1>
                <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    OpenShelf is a platform dedicated to making education more accessible by facilitating the sharing of textbooks and course materials among university students.
                </p>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Our Mission</h2>
                    <p>
                        Textbooks are expensive. We believe that no student should fall behind because they cannot afford the required reading materials. By connecting students who have finished their courses with those just starting, we create a sustainable cycle of sharing.
                    </p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">How to Contribute</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Create an account using your university email.</li>
                        <li>List books you no longer need.</li>
                        <li>Respond to requests from other students.</li>
                        <li>Meet on campus to hand over the books.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
