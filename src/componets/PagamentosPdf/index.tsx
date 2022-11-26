import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";


type VendasProps = {
  id: string;
  name: string;
  price: string;
  amount: string;
  created_at: string;
  total_sale: number;
};
type DateProps = {
  DataInicial: string;
  DataFinal: string;
};
interface VendasListProps {
  vendaslistDate: VendasProps[] | undefined;
  Periodo: DateProps;
}
export default function PagamentosPdf({
  vendaslistDate,
  Periodo,
}: VendasListProps) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const total = vendaslistDate?.reduce((q, m) => {
    return (q += m.total_sale);
  }, 0);
  const dados = vendaslistDate?.map((item) => {
    return [
      {
        text: item.name,
        style: "tableHeader",
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
      {
        text: item.created_at,
        style: "tableHeader",
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
      {
        text: item.amount as string,
        style: "tableHeader",
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
      {
        text: item.price as string,
        style: "tableHeader",
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
      {
        text: item.total_sale.toFixed(2).replace(".", ","),
        style: "tableHeader",
        fontSize: 9,
        margin: [0, 2, 0, 2],
      },
    ];
  });
  const docDefinitions: TDocumentDefinitions = {
    defaultStyle: { margin: [15, 50, 15, 40] },
    content: [
      {
        text: "Relatorio de Vendas ",
        fontSize: 15,
        bold: true,

        style: "header",
      },
      {
        text: "Restaurante pimenta-malagueta",
        fontSize: 8,

        style: "subheader",
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*"],

          body: [
            [
              { text: "Nome", style: "tableHeader", fontSize: 10 },
              { text: "Data", style: "tableHeader", fontSize: 10 },
              { text: "Qtd", style: "tableHeader", fontSize: 10 },
              { text: "Preço", style: "tableHeader", fontSize: 10 },
              { text: "Total", style: "tableHeader", fontSize: 10 },
            ],
            ...dados,
          ],
        },

        layout: "lightHorizontalLines",
      },
      {
        table: {
          headerRows: 1,
          widths: ["*"],
          body: [
            [
              {
                text: `Total: ${total?.toFixed(2).replace(".", ",")}`,
                style: "tableHeader",
                alignment: "right",
                fontSize: 10,
                bold: true,
              },
            ],
          ],
        },
      },
    ],
    header: [
      {
        text: `${Periodo.DataInicial} a ${Periodo.DataFinal}`,
        fontSize: 8,
        bold: true,
        margin: [20, 5, 15, 70],
        alignment: "right",
        style: "header",
      },
    ],

    footer: function (currentPage, pageCount) {
      return [
        {
          text: currentPage + " / " + pageCount,
          alignment: "right",
          fontSize: 9,
          margin: [0, 10, 20, 0],
        },
      ];
    },
  };

  pdfMake.createPdf(docDefinitions).open();
}
