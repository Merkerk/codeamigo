import * as babel from "@babel/standalone";
import { ControlledEditor, monaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import {
  RegularStepFragment,
  useStepQuery,
  useUpdateCodeModuleMutation,
} from "../../../generated/graphql";
import { CodeSandboxV2ResponseI } from "../../api/types";
import { debounce } from 'debounce'

type FilesType = { [key in string]: string };

const transformCode = (code: string, path: string) => {
  return babel.transform(code, {
    presets: ["es2015", "typescript", "react"],
    filename: path,
  });
};

const runCode = (files: FilesType, runPath: string) => {
  const code = files[runPath];
  const babelOutput = transformCode(code, runPath);

  const require = (path: string) => {
    return runCode(files, path);
  };
  const exports = {};
  const module = { exports };

  eval(babelOutput.code);

  return module.exports;
};

const Editor: React.FC<Props> = ({ step }) => {
  const [files, setFiles] = React.useState({} as FilesType);
  const [dependencies, setDependencies] = React.useState({} as FilesType);
  const [currentPath, setCurrentPath] = React.useState("");
  const [currentCode, setCurrentCode] = React.useState("");
  const [outputCode, setOutputCode] = React.useState("");

  const { data } = useStepQuery({ variables: { id: step.id } });
  const [updateCodeModule] = useUpdateCodeModuleMutation();

  const updateFile = debounce((path: string, code: string) => {
    setFiles({
      ...files,
      [path]: code,
    });

    setCurrentCode(code);

    const currentModule = data?.step?.codeModules?.find(
      (module) => module.name === path
    );

    // create?
    if (!currentModule) return;

    updateCodeModule({
      variables: {
        id: currentModule.id,
        name: path,
        value: code,
      },
    });
  }, 1000);

  useEffect(() => {
    if (!data?.step?.codeModules) return;

    const mods = data.step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    setFiles(mods);
  }, [data?.step?.codeModules]);

  useEffect(() => {
    try {
      const { code } = transformCode(currentCode, currentPath);

      setOutputCode(code);
    } catch (e) {
      setOutputCode(e.message);
    }
  }, [currentCode, currentPath]);

  const editorDidMount = (_: any, editor: any) => {
    async function getDeps() {
      // TODO, make dynamic!
      const dep1: CodeSandboxV2ResponseI = await fetch(
        "https://prod-packager-packages.codesandbox.io/v2/packages/jest-lite/1.0.0-alpha.4.json"
      ).then((res) => res.json());

      const dependency =
        dep1.contents["/node_modules/jest-lite/dist/core.js"].content;

      setDependencies({
        ...dependencies,
        [dep1.dependency.name]: dependency,
      });

      const monacoInstance = await monaco.init();

      // validation settings
      monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
        {
          noSemanticValidation: true,
          noSyntaxValidation: false,
        }
      );

      // compiler options
      monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions(
        {
          target: monacoInstance.languages.typescript.ScriptTarget.ESNext,
          allowSyntheticDefaultImports: true,
          allowNonTsExtensions: true,
          typeRoots: ["node_modules/@types"],
        }
      );

      // const fakeFiles = Object.keys(dep1.contents).reduce((acc, curr) => ({
      //   ...acc,
      //   [curr]: dep1.contents[curr].content
      // }), {})

      // for (const fileName in fakeFiles) {
      //   const fakePath = `file:///node_modules/@types/${fileName}`;

      //   monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
      //     // @ts-ignore
      //     fakeFiles[fileName],
      //     fakePath
      //   );
      // }
    }

    getDeps();
  };

  return (
    <div className="flex w-full">
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <h3>Initial Code</h3>
        <div className="flex rounded-md border border-gray-200 whitespace-nowrap">
          <div>
            {Object.keys(files).map((path) => (
              <button
                className="text-xs block mb-1"
                key={path}
                onClick={() => setCurrentPath(path)}
                type="button"
              >
                {path}
              </button>
            ))}
          </div>
          <ControlledEditor
            height="300px"
            width="100%"
            language={"typescript"}
            value={files[currentPath]}
            options={{
              minimap: { enabled: false },
            }}
            editorDidMount={editorDidMount}
            onChange={(_, value) => updateFile(currentPath, value || "")}
          />
        </div>
      </div>
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <button
          type="button"
          onClick={() => runCode({ ...files, ...dependencies }, currentPath)}
        >
          Run
        </button>
        <div>{outputCode}</div>
      </div>
    </div>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Editor;
