import { ChangeDetectorRef, Component, effect, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ImportsModule } from '../../tools/imports';
import { SideBarComponent } from '../items/side-bar/side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [ConfirmationService, MessageService, SideBarComponent]
})
export class DashboardComponent implements  OnInit, OnDestroy {

  private themeSubscription: any;

  basicData: any;
  basicOptions: any;

  data: any;
  options: any;

  dataVB: any;
  optionsVB: any;

  dataLS: any;
  optionsLS: any;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {

    // Suscribirse al evento de cambio de tema
    this.themeSubscription = this.themeService.getThemeChangedObservable().subscribe(() => {
      this.updateColors();
    });
    this.updateColors();
 
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();  // Limpiar la suscripción al destruir el componente
    }
  }

  private updateColors(){

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Grafica Bar
    this.basicData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Sales',
                data: [540, 325, 702, 620],
                backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                borderWidth: 1
            }
        ]
    };

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    // Grafica Pie
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
          {
              data: [540, 325, 702],
              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
          }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false, // Para permitir la personalización de la altura
      height: 600, // Ajusta este valor según lo que necesites
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };


    this.dataVB = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'My First dataset',
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              backgroundColor: documentStyle.getPropertyValue('--pink-500'),
              borderColor: documentStyle.getPropertyValue('--pink-500'),
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
    };

    this.optionsVB = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }

        }
    };


    this.dataLS = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              tension: 0.4,
              borderColor: documentStyle.getPropertyValue('--blue-500')
          },
          {
              label: 'Second Dataset',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              borderDash: [5, 5],
              tension: 0.4,
              borderColor: documentStyle.getPropertyValue('--teal-500')
          },
          {
              label: 'Third Dataset',
              data: [12, 51, 62, 33, 21, 62, 45],
              fill: true,
              borderColor: documentStyle.getPropertyValue('--orange-500'),
              tension: 0.4,
              backgroundColor: 'rgba(255,167,38,0.2)'
          }
      ]
    };
    
    this.optionsLS = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

  }

}
