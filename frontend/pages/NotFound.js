import Link from 'next/link'

export default function NotFound({ pollId }) {
    return (
        <div>
            <div className="flex items-center justify-center w-screen h-screen">
                <div className="px-4 lg:py-12">
                    <div className="lg:gap-4 lg:flex">
                        <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
                            <h1 className="font-bold text-gray-500 text-6xl">404</h1>
                            <p className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                                <span className="text-teal-500">Oops!</span>
                                Poll id: {pollId} was not found.
                            </p>
                            <p className="mb-8 text-center text-gray-500 md:text-lg">
                                The poll might have expired.
                            </p>
                            <Link href="/">
                                <a className="px-6 py-2 text-sm font-semibold text-teal-800 bg-gray-200 hover:bg-gray-300 cursor-pointer">
                                    Create new Poll
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
