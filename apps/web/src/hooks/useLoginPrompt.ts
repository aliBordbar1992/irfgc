import { useState } from "react";
import { useSession } from "next-auth/react";

export function useLoginPrompt() {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const checkAuthAndExecute = (callback: () => void) => {
    if (!session?.user?.id) {
      setShowLoginModal(true);
      return false;
    }
    callback();
    return true;
  };

  const loginPromptProps = {
    isOpen: showLoginModal,
    onClose: () => setShowLoginModal(false),
  };

  return {
    isAuthenticated: !!session?.user?.id,
    showLoginModal,
    setShowLoginModal,
    checkAuthAndExecute,
    loginPromptProps,
  };
}
