import { useDeleteTeam } from "../hooks";

type DeleteTeamDialogProps = {
  isOpen: boolean;
  onClose?: () => void;
  teamId: string;
  teamName: string;
};

export const DeleteTeamDialog: React.FC<DeleteTeamDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
}) => {
  const deleteTeamMutation = useDeleteTeam();

  const handleDelete = async () => {
    try {
      await deleteTeamMutation.mutateAsync(teamId);
      onClose?.();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-base-100 rounded-lg p-6 mx-4 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-medium text-base-content mb-3">
          Delete team
        </h3>
        <p className="text-base-content/70 mb-6 leading-relaxed">
          Are you sure you want to delete <strong>"{teamName}"</strong>? This
          action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            className="text-base-content/60 hover:text-base-content transition-colors px-3 py-2"
            onClick={onClose}
            disabled={deleteTeamMutation.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={deleteTeamMutation.isPending}
          >
            {deleteTeamMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete team"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
