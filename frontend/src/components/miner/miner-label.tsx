import { getMinerConfigByID } from "@/config/miner-config";
import Link from "next/link";

export default function MinerLabel({ minerID, enableLink = true }: { minerID: string; enableLink?: boolean }) {
    const minerConfig = getMinerConfigByID(minerID);

    if (!minerConfig) {
        return <span className="font-mono">{minerID}</span>;
    }

    const label = (
        <span className="inline-flex items-center gap-2">
            {minerConfig.iconURL ? (
                <img
                    src={minerConfig.iconURL}
                    alt={minerConfig.name}
                    className="h-5 w-5 rounded-full object-cover"
                    loading="lazy"
                />
            ) : null}
            <span className="font-mono">{minerConfig.name}</span> 
        </span>
    );

    if (enableLink && minerConfig.website) {
        return (
            <Link
                href={minerConfig.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
                {label}
            </Link>
        );
    }

    return label;
}