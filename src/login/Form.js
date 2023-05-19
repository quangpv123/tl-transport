import { useForm } from "react-hook-form";
import axios from "axios";
export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    let url = "/api/login";
    await axios.post(url, data).then((response) => {
      console.log(response);
      window.location.reload();
    });
  };
  return (
    <div className="mx-auto p-6 rounded-lg bg-white max-w-lg">
      <h2 className="text-center text-[28px] text-black3 font-medium leading-[1.1] mt-5 mb-[10px]">
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Tên đăng nhập</label>
        <input
          className="form-control block w-full px-3 py-1.5 text-base font-normal
      text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300
      rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white
      focus:border-blue-600 focus:outline-none"
          defaultValue=""
          {...register("user")}
        />
        <label>Mật khẩu</label>
        <input
          type = "password"
          className="form-control block w-full px-3 py-1.5 text-base font-normal
      text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300
      rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white
      focus:border-blue-600 focus:outline-none"
          {...register("password", { required: true })}
        />
        {errors.exampleRequired && <span>This field is required</span>}
        <input
          type="submit"
          className=" px-6 py-2.5 bg-[#337AB7] text-white font-medium text-xs leading-tight uppercase rounded transition duration-150 ease-in-out "
        />
      </form>
      <div className=" flex justify-center items-center"></div>
    </div>
  );
}