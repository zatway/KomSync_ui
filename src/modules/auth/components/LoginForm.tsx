import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLoginMutation} from "@/modules/auth/api/authApi";
import {Button} from "@/shared/ui_shadcn/button";
import {Logo} from "@/shared/ui/Logo/Logo";
import {Link, useNavigate} from "react-router-dom";
import {AppRoutes} from "@/app/routes/AppRoutes";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui_shadcn/form";
import {Input} from "@/shared/ui_shadcn/input";
import {getApiErrorMessage} from "@/shared/lib";
import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

const loginSchema = z.object({
    email: z.string().min(1, "Укажите email").email("Некорректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const [login, {isLoading, error}] = useLoginMutation();
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const navigate = useNavigate();

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: "", password: ""},
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const handleSubmit = async (values: LoginValues) => {
        try {
            await login({
                email: values.email.trim(),
                password: values.password,
            }).unwrap();
            navigate(AppRoutes.PROJECTS);
        } catch {
            /* сообщение об ошибке — из RTK `error` ниже */
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-card p-6 sm:p-8 shadow-lg border">
            <div className="flex justify-center mb-6">
                <Logo height={100}/>
            </div>

            <div className="text-center mb-6">
                <h2 className="font-bold text-lg">Войдите в систему</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Почта</FormLabel>
                                <FormControl>
                                    <Input type="email" autoComplete="email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) =>
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2"
                    >
                        {isLoading ? "Вход…" : "Войти"}
                    </Button>
                    <Link
                        to={AppRoutes.FORGOT_PASSWORD}
                        className="text-center text-sm text-muted-foreground hover:underline"
                    >
                        Забыли пароль?
                    </Link>
                    <button
                        type="button"
                        className="text-sm text-muted-foreground hover:underline text-center"
                        onClick={() => navigate(AppRoutes.REGISTER)}
                    >
                        Нет аккаунта? Создать
                    </button>
                    {error ? (
                        <p className="rounded-md p-2 text-center text-sm text-destructive">
                            {getApiErrorMessage(error)}
                        </p>
                    ) : null}
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
