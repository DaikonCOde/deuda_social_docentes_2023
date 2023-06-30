"use client";
import { Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import SpinLoader from "./components/spinLoader/spinLoader.component";

type TypeValuesForm = {
  pliego: {
    value: string;
    error: boolean;
    message?: string;
  };
  dni: {
    value: string;
    error: boolean;
    message?: string;
  };
};
type TypeItemEstado = {
  Pliego: string;
  usuarios: number;
};

const initialState = {
  pliego: {
    value: "",
    error: false,
  },
  dni: {
    value: "",
    error: false,
  },
};

export default function Home() {
  const [values, setValues] = useState<TypeValuesForm>(initialState);
  const [listaEstados, setlistaEstados] = useState<TypeItemEstado[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [consulta, setConsulta] = useState({
    showModal: false,
    consulta: false,
  });

  useEffect(() => {
    const getListEstados = async () => {
      const lista = await fetch("/estados.json");
      const resp = await lista.json();

      setlistaEstados(resp);
    };

    getListEstados();
  }, []);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    const regex = /^\d+$/;
    if (!regex.test(value) && !!value.length) return;
    if (value.toString().length === 9) return;
    setValues((prev) => ({
      ...prev,
      dni: {
        value,
        error: false,
      },
    }));
  };
  const handleSelect = (value: string) => {
    setValues((prev) => ({
      ...prev,
      pliego: {
        value,
        error: false,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const successForm = validateForm();
    if (!successForm) return;

    setLoading(true);

    // TODO: realizar el llamado del archivo

    const file = await getFile();

    const user = file.filter(
      (item: any) => item["N° Doc."] === values.dni.value
    );

    setLoading(false);

    setConsulta({
      showModal: true,
      consulta: !!user.length,
    });
  };

  const getFile = async () => {
    const file = await fetch(`/${values.pliego.value}.json`);
    const response = await file.json();

    return response;
  };

  const validateForm = (): boolean => {
    let success = true;

    if (!!!values.dni.value) {
      setValues((prev) => ({
        ...prev,
        dni: {
          value: prev.dni.value,
          error: true,
        },
      }));
      success = false;
    }

    if (!!values.dni.value.length && values.dni.value.length < 8) {
      setValues((prev) => ({
        ...prev,
        dni: {
          value: prev.dni.value,
          error: true,
          message: "DNI invalido.",
        },
      }));
      success = false;
    }

    if (!!!values.pliego.value) {
      setValues((prev) => ({
        ...prev,
        pliego: {
          value: prev.pliego.value,
          error: true,
        },
      }));

      success = false;
    }

    return success;
  };

  const handleOk = () => {
    setConsulta({
      showModal: false,
      consulta: false,
    });

    setValues(initialState);
  };

  return (
    <>
      <main className="bg-principal w-full h-main-element flex justify-center items-center relative">
        <div className="content lg:max-w-2xl px-4">
          <h1 className="text-3xl text-title text-center">
            Conoce si eres beneficiario de la deuda social a docentes - 2023
          </h1>

          <div className="mt-24 max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="pliego" className="block text-title mb-2">
                  Selecciona tu pliego
                  <span className="text-red-500 text-xs align-top">*</span>
                </label>
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  id="pliego"
                  size="large"
                  className="w-full"
                  onChange={handleSelect}
                >
                  {listaEstados.map((item) => (
                    <Select.Option value={item.Pliego} key={item.Pliego}>
                      {item.Pliego}{" "}
                      <span className="text-xs text-secondary">
                        ({item.usuarios})
                      </span>
                    </Select.Option>
                  ))}
                </Select>
                {values.pliego.error ? (
                  <span className="text-red-500 text-xs inline-block mt-1">
                    Este campo es requerido
                  </span>
                ) : null}
              </div>
              <div className="mb-6">
                <label htmlFor="dni" className="block text-title mb-2">
                  Introduce tu N° DNI
                  <span className="text-red-500 text-xs align-top">*</span>
                </label>
                <Input
                  onChange={handleInput}
                  className="w-full block"
                  id="dni"
                  size="large"
                  value={values.dni.value}
                />
                {values.dni.error ? (
                  <span className="text-red-500 text-xs inline-block mt-1">
                    {!!values.dni.message
                      ? values.dni.message
                      : "Este campo es requerido"}
                  </span>
                ) : null}
              </div>
              <button
                type="submit"
                className="py-3 px-3 rounded-xl bg-secondary text-white font-bold block mt-8 w-full hover:bg-hover_secondary"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
        {loading ? <SpinLoader /> : null}
        <Modal
          title=""
          open={consulta.showModal}
          footer={null}
          onCancel={handleOk}
        >
          <div className="h-60  flex flex-col justify-center items-center">
            <p
              className={` text-2xl font-bold text-center leading-9 ${
                !!consulta.consulta ? "text-[#04BF8A]" : "text-[#FF4858]"
              }`}
            >
              {consulta.consulta ? (
                <span>
                  Felicidades! <br /> Eres beneficiario{" "}
                </span>
              ) : (
                <span>
                  Lo sentimos, <br /> No eres beneficiario
                </span>
              )}
            </p>

            <button
              className="py-3 px-3 rounded-xl bg-secondary text-white font-bold block mt-12 w-full max-w-xs hover:bg-hover_secondary"
              onClick={handleOk}
            >
              Realizar otra consulta
            </button>
          </div>
        </Modal>
      </main>
      <footer className="bg-secondary h-[30px] flex justify-center items-center">
        <span className="text-white text-sm">
          Creado por{" "}
          <span className="font-bold underline underline-offset-2 cursor-pointer">
            Alex Ocsa
          </span>
        </span>
      </footer>
    </>
  );
}
