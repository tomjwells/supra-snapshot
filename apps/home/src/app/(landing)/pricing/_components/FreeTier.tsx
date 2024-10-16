import Image from "next/image"
import { PRICING } from "@data/constants"
import { CheckIcon, CloudArrowUpIcon, LockClosedIcon, ServerIcon } from "@heroicons/react/20/solid"

export default function FreeTier() {
  const frequency = "monthly"

  return (
    <div className="py-24 sm:py-32" id="free-tier">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Free Tier</h2>
          <p className="mt-2 text-6xl font-bold tracking-tight text-white">Free Tier</p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          The free tier is our way of supporting small projects and giving an easy way to try out
          Supra.
        </p>

        <FreeTierX />
      </div>
    </div>
  )
}

const features = [
  {
    name: "Free payment processing.",
    description: `Everyone benefits from the free-tier automatically, sellers are only charged our fees anything you make above $${PRICING.freeTierThreshold} each month - a great way to run your projects`,
    icon: ServerIcon,
  },
  {
    name: "Premium features.",
    description: "Enjoy all of the same features and functionality as the paid tier",
    icon: LockClosedIcon,
  },
]

export function FreeTierX() {
  return (
    <div className="overflow-hidden  py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <dl className="max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-100">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src="/screenshots/free-tier/free-tier.png"
              width={2974}
              height={1654}
              alt="Free Tier"
              className="max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
