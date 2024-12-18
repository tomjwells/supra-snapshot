import React from "react"

function Notifications() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-slate-12">Notifications</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          We'll always let you know about important changes, but you pick what else you want to hear about.
        </p>
      </div>

      <form className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-slate-1 md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="max-w-2xl space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-slate-12">By Email</legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input id="comments" name="comments" type="checkbox" className="h-4 w-4 rounded border-slate-7 text-indigo-600 focus:ring-indigo-600" />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-slate-12">
                      Comments
                    </label>
                    <p className="text-slate-10">Get notified when someones posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input id="candidates" name="candidates" type="checkbox" className="h-4 w-4 rounded border-slate-7 text-indigo-600 focus:ring-indigo-600" />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="candidates" className="font-medium text-slate-12">
                      Candidates
                    </label>
                    <p className="text-slate-10">Get notified when a candidate applies for a job.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input id="offers" name="offers" type="checkbox" className="h-4 w-4 rounded border-slate-7 text-indigo-600 focus:ring-indigo-600" />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="offers" className="font-medium text-slate-12">
                      Offers
                    </label>
                    <p className="text-slate-10">Get notified when a candidate accepts or rejects an offer.</p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-slate-12">Push Notifications</legend>
              <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input id="push-everything" name="push-notifications" type="radio" className="h-4 w-4 border-slate-7 text-indigo-600 focus:ring-indigo-600" />
                  <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-slate-12">
                    Everything
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input id="push-email" name="push-notifications" type="radio" className="h-4 w-4 border-slate-7 text-indigo-600 focus:ring-indigo-600" />
                  <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-slate-12">
                    Same as email
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input id="push-nothing" name="push-notifications" type="radio" className="h-4 w-4 border-slate-7 text-indigo-600 focus:ring-indigo-600" />
                  <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-slate-12">
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button type="button" className="text-sm font-semibold leading-6 text-slate-12">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default Notifications
