
export default function createPagesAdd (prefix, allPrefix){
    let s = ''

    s=s+(
        "import dynamic from 'next/dynamic'\n"+

        "const DynamicComponentWithNoSSR = dynamic(\n"+
            "() => import('@/modules/"+prefix+"/pages/add'),\n"+
            "{ ssr: false }\n"+
            ")\n"+
        "function\t"+allPrefix+ "Add"+"() {\n"+
        "return (\n"+
        "<DynamicComponentWithNoSSR />\n"+
        " )\n"+
        " }\n"+

        "\n" +"export default " + allPrefix + "Add");
    return s;
}


