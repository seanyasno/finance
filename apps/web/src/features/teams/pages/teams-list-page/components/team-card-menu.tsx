import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { DeleteTeamDialog } from "@/features/teams";
import { IoEllipsisVertical, IoPencil, IoTrash } from "react-icons/io5";

type TeamCardMenuProps = {
  teamId: string;
  teamName: string;
};

export const TeamCardMenu: React.FC<TeamCardMenuProps> = ({
  teamId,
  teamName,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-sm btn-square"
        >
          <IoEllipsisVertical className="inline-block w-4 h-4 stroke-current" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link
              to="/teams/$teamId/edit"
              params={{ teamId }}
              className="flex items-center gap-2"
            >
              <IoPencil className="w-4 h-4" />
              Edit Team
            </Link>
          </li>
          <li>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 text-error hover:bg-error/10"
            >
              <IoTrash className="w-4 h-4" />
              Delete Team
            </button>
          </li>
        </ul>
      </div>

      <DeleteTeamDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        teamId={teamId}
        teamName={teamName}
      />
    </>
  );
};
