import { X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function LikesOverlay({ postId, onClose }) {
  const { backendUrl } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/post/${postId}/likes`
        );

        setUsers(data.data || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [postId, backendUrl]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/50 px-3">
      <div className="w-full max-w-sm bg-paper-alt border border-navy p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between pb-3 border-b border-brass/30">
          <p className="font-display font-semibold text-navy">
            Liked By
          </p>

          <X
            size={18}
            onClick={onClose}
            className="cursor-pointer text-muted hover:text-oxblood transition-colors"
          />
        </div>

        {/* Content */}
        <div className="max-h-[240px] space-y-1 overflow-y-auto">
          {loading ? (
            <p className="text-center font-body text-sm text-muted py-4">
              Loading...
            </p>
          ) : users.length === 0 ? (
            <p className="text-center font-body text-sm text-muted py-4">
              No likes yet
            </p>
          ) : (
            users.map((user) => (
              <a
                key={user._id}
                href={`/profile/${user.uniqueId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-paper transition-colors"
              >
                <img
                  src={user.avatar || assets.profile}
                  alt={user.firstName}
                  className="h-9 w-9 object-cover border border-brass/50"
                />

                <span className="font-body text-sm text-ink">
                  {user.firstName} {user.lastName}
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}