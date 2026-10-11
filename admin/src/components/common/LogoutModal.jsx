import Button from "./Button";

export const LogoutModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="mx-auto w-[90%] rounded-lg md:rounded-xl lg:rounded-2xl bg-white  md:w-full p-4 md:p-5 lg:p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 md:h-12 md:w-12">
        <i className="ri-emotion-sad-line text-xl md:text-2xl"></i>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
        Logout Confirmation
      </h2>
      <p className="mt-2 text-xs text-gray-500 md:text-sm">
        Are you sure you want to logout? You&apos;ll be redirected to the login
        page.
      </p>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" className="cursor-pointer" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          icon="logout-box-r-line"
          className="cursor-pointer"
          variant="danger"
          onClick={onConfirm}>
          Logout
        </Button>
      </div>
    </div>
  );
};
