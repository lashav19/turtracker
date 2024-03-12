let ctx = document.getElementById("myChart").getContext("2d");
      let myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Mandag",
            "Tirsdag",
            "Onsdag",
            "Torsdag",
            "Fredag",
            "Lørdag",
            "Søndag",
          ],
          datasets: [
            {
              label: [],
              data: [2, 4, 3, 5, 6, 3, 7],
              backgroundColor: "rgb(0,102,255)",
              barPercentage: 0.6,
              borderRadius: 4,
            },
          ],
        },
        options: {
          plugins:{
            legend:{
              display: false,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          animations: {
            tension: {
              duration: 1000,
              easing: "linear",
              from: 1,
              to: 0,
              loop: true,
            },
          },
        },
      },
      );