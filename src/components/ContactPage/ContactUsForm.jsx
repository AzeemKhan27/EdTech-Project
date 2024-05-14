import React, { useState, useEffect } from 'react'

function ContactUsForm() {

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSucessful}
    } = useForm();

    const submitContactForm = async (data) => {

    }

    useEffect(() => {
      
        if(isSubmitSucessful) {
            reset({
                email: '',
                firstname: '',
                lastname: '',
                message: '',
                phoneNo: '',
            })
        }
      
    }, [isSubmitSucessful, reset]);
    

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
        
        <div>
            {/* firstName  */}
            <div className="flex flex-col">
                <label htmlFor="firstname">First Name</label>
                <input 
                    type="text" 
                    name="firstname" 
                    id="firstname" 
                    placeholder='Enter First Name'
                    ref={register({ required: true })}   //OR {...register({ required: true})}
                />
                {
                    errors.firstname && (
                        <span>
                            Please enter your name
                        </span>
                    )
                }
            </div>

            {/* lastName  */}
            <div className="flex flex-col">
                <label htmlFor="lastname">Last Name</label>
                <input 
                    type="text" 
                    name="lastname" 
                    id="lastname" 
                    placeholder='Enter Last Name'
                    ref={register("lastname")}   //OR {...register({ required: true})}
                />


        </div>

    </form>
  )
}

export default ContactUsForm