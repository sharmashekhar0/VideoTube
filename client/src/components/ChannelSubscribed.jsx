import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ChannelSubscribed({ subscribedTo }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredSubscriptions, setFilteredSubscriptions] =
		useState(subscribedTo);

	useEffect(() => {
		setFilteredSubscriptions(
			subscribedTo.filter((channel) =>
				channel.fullName
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			)
		);
	}, [searchQuery, subscribedTo]);

	return (
		<div className="flex flex-col gap-y-4 py-4">
			<div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
				<span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="2"
						stroke="currentColor"
						aria-hidden="true"
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						></path>
					</svg>
				</span>
				<input
					className="w-full bg-transparent outline-none"
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			{filteredSubscriptions.map((channelSubscribed) => (
				<Link to={`/api/v1/users/c/${channelSubscribed?.username}`}>
					<div
						className="flex w-full justify-between"
						key={channelSubscribed.id}
					>
						<div className="flex items-center gap-x-2">
							<div className="h-14 w-14 shrink-0">
								<img
									src={channelSubscribed?.avatar}
									alt={channelSubscribed.fullName}
									className="h-full w-full rounded-full object-cover"
								/>
							</div>
							<div className="block">
								<h6 className="font-semibold">
									{channelSubscribed.fullName}
								</h6>
								<p className="text-sm text-gray-300">
									{channelSubscribed?.subscriberCount || 0}{" "}
									Subscribers
								</p>
							</div>
						</div>
						{/* <div className="block">
							<button
								className={`px-3 py-2 text-black bg-[#ae7aff]`}
							>
								<span className="">Subscribed</span>
							</button>
						</div> */}
					</div>
				</Link>
			))}
		</div>
	);
}

export default ChannelSubscribed;
