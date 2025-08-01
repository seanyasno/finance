import { FormProvider, useForm } from "react-hook-form";
import { type TeamFormData, TeamFormSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";

type TeamFormProviderProps = {
  children: React.ReactNode;
  defaultValues?: Partial<TeamFormData>;
};

export const TeamFormProvider: React.FC<TeamFormProviderProps> = ({
  children,
  defaultValues,
}) => {
  const form = useForm<TeamFormData>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: {
      teamName: "",
      teamDescription: "",
      selectedPokemon: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};
